import datetime
import json
import time
import sys
from typing import Dict, List, Tuple


import arrow  # type: ignore
import stravalib  # type: ignore
from sqlalchemy import func

from .db import init_db, update_or_create_activity, Athlete, Activity


class Generator:
    def __init__(self, db_path: str, client_id: str, client_secret: str, refresh_token: str):
        self.client = stravalib.Client()
        self.session = init_db(db_path)

        self.client_id = client_id
        self.client_secret = client_secret
        self.refresh_token = refresh_token 


    def check_access(self) -> None:
        now = datetime.datetime.fromtimestamp(time.time())
        response = self.client.refresh_access_token(
            client_id=self.client_id, client_secret=self.client_secret, refresh_token=self.refresh_token,
        )
        # Update the authdata object
        self.access_token = response["access_token"]
        self.refresh_token = response["refresh_token"]
        self.expires_at = datetime.datetime.fromtimestamp(response["expires_at"])

        self.client.access_token = response["access_token"]
        print("Access ok")

    def sync(self, force: bool = False) -> None:
        self.check_access()
        strava_athlete = self.client.get_athlete()

        athlete = self.session.query(Athlete).filter_by(id=strava_athlete.id).first()
        if not athlete:
            athlete = Athlete(
                id=strava_athlete.id, firstname=strava_athlete.firstname, lastname=strava_athlete.lastname,
            )
            self.session.add(athlete)
            self.session.commit()

        print("Start syncing")
        if force:
            filters = {"before": datetime.datetime.utcnow()}
        else:
            last_activity = self.session.query(func.max(Activity.start_date)).scalar()
            if last_activity:
                last_activity_date = arrow.get(last_activity)
                last_activity_date = last_activity_date.shift(days=-7)
                filters = {"after": last_activity_date.datetime}
            else:
                filters = {"before": datetime.datetime.utcnow()}

        for strava_activity in self.client.get_activities(**filters):
            created = update_or_create_activity(self.session, athlete, strava_activity)
            if created:
                sys.stdout.write("+")
            else:
                sys.stdout.write(".")
            sys.stdout.flush()

        self.session.commit()

    def load(self) -> Tuple[Dict, List[Dict]]:
        athlete = self.session.query(Athlete).first()
        activities = self.session.query(Activity).filter_by(athlete_id=athlete.id).order_by(Activity.start_date_local)

        athlete_dict = athlete.to_dict()
        activity_list = []

        streak = 0
        last_date = None
        for activity in activities:
            # Determine running streak.
            if activity.type == "Run":
                date = datetime.datetime.strptime(activity.start_date_local, "%Y-%m-%d %H:%M:%S").date()
                if last_date is None:
                    streak = 1
                elif date == last_date:
                    pass
                elif date == last_date + datetime.timedelta(days=1):
                    streak += 1
                else:
                    assert date > last_date
                    streak = 1
                activity.streak = streak
                last_date = date
                # Determine visited POIs.
                # Append to result list.
                # only run to show
                activity_list.append(activity.to_dict())

        return athlete_dict, activity_list
