import json
import sys
from backend.scraper.code.stackOverflowScraper import StackOverflowProfile


class UserProfile:

    def __init__(self, user_details):
        "takes the user details dictionary and creates object which is composed of scraper objects"

        self._username = user_details["username"]
        self._links = user_details["links"] if "links" in user_details else {}

        if len(self._links) > 0:
            self._stack_profile = StackOverflowProfile(
                self._links["stack_profile"]) if "stack_profile" in user_details["links"] else None

    def get_next_stack_tag(self):
        return self._stack_profile.getTopTags().__next__() if self._stack_profile is not None else None

    def get_next_asked_stack_post(self):
        return self._stack_profile.getAskedPosts().__next__() if self._stack_profile is not None else None

    def get_next_answered_stack_post(self):
        return self._stack_profile.getAnsweredPosts().__next__() if self._stack_profile is not None else None

    def get_username(self):
        return self._username


if __name__ == "__main__":
    input_json = json.loads(sys.argv[1])
    profile = UserProfile(input_json)
    output = {
        'text': profile.get_next_asked_stack_post().getPost()
    }
    sys.stdout.write(json.dumps(output))