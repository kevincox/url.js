# Contributing to url.js

## Tests

Tests are critical.  Your patch should pass all tests.  In general no tests
should be removed, in rare cases changing tests and breaking compatibility can
be done for patches intended to be included in major version upgrades.

Any patch with functional code changes should include new tests.  These tests
should fail without your patch applied and pass with the patch. (AKA your tests
should show that the previous version didn't work as intended/desired and your
new version does)

## Style

### Formatting

Copy what is already there.  We are not incredibly picky.  Don't let this stop
you from submitting a patch, if it is an issue you will be asked to fix it as
a final cleanup.  Some major points are below.

#### Indentation

Indent with tabs, use whatever tab size you want.  Align continuation lines with
spaces.  In the below example `→` will be used to represent tab characters and 
`·` will be used for spaces.

```js
function f() {
→   afunc(a,
→   ······b,
→   ······c);
→
→   return x +
→   ·······y;
}
```

#### Empty Lines

Leave whitespace in empty lines.  Indent them as if they have code in them.

```js
function f()
{
→   var x; // Note: following line still has a tab.
→   
→   return 4;
}
```

### History

We **do not** require that you continuously rebase on master.  However it is
encouraged to make your commit history tidy before it is merged.  Don't worry
about this while you patch is being reviewed and tweaked but consider tidying up
your commits before the actual merge.

## Sending the Code

### Diff

We recommend generating a patch using `git format-patch --stdout`.  Either mail
the patch or attach it to the issue.

### Pull Request

You can send us a pull request to a public git repo.  You can use github's pull
request feature if you have a github repo, otherwise just tell us the public
repo to pull from.  Also include the desired branch.  *PLEASE* use a dedicated
branch per issue.  This way you can still work on other branches while the pull
process is ongoing, the pull request branch must only be updated with related
commits.

## Licence and Copyright

To contribute to the project you must agree to release your work under the
project's licence.  To do this add your name and contribution year(s) to the top
of the file (please add your name at the end, if you contribute multiple
consecutive years you can change the existing line to a range).  When you submit
your patch you must declare that you are releasing your code under the licence
of the project (at the top of each file).

<!--- vi:tw=80
-->
