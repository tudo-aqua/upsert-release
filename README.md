Upsert-Release Action
-----------------------

We want to keep a release of nightly builds of the master branch available
at Github in the release sections. As every build needs to be associated
with a tag, this action moves the tag for the head commit forward and
updates the release by replacing it. Repleacing means the **deletion** of the old release before recreating one with the same name for the moved tag. Next, the [upload release asset action](https://github.com/actions/upload-release-asset) can be used to upload assets to the release.

As the old release is deleted during the execution of this action and the new release might be empty if the upload-release-asset action fails, this could leave the release section of the repository in an undesired shape if the workflow fails for the current head commit.

License
-------
This action is released under the Apache-2.0 license.

Copyright 2020, TU Dortmund, Malte Mues (@mmuesly)
