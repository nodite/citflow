citflow
=================

A amazing command line interface to operate citflow.


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/citflow.svg)](https://npmjs.org/package/citflow)
[![Downloads/week](https://img.shields.io/npm/dw/citflow.svg)](https://npmjs.org/package/citflow)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g citflow
$ citflow COMMAND
running command...
$ citflow (--version)
citflow/0.0.0 darwin-arm64 node-v20.18.3
$ citflow --help [COMMAND]
USAGE
  $ citflow COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`citflow help [COMMAND]`](#citflow-help-command)
* [`citflow login`](#citflow-login)

## `citflow help [COMMAND]`

Display help for citflow.

```
USAGE
  $ citflow help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for citflow.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.28/src/commands/help.ts)_

## `citflow login`

Login to CI&T Flow

```
USAGE
  $ citflow login [--channel portal]

FLAGS
  --channel=<option>  [default: portal] The channel through which the request is made, affecting the resulting URL.
                      <options: portal>

DESCRIPTION
  Login to CI&T Flow

EXAMPLES
  $ citflow login --channel=portal
  Logging in to CI&T Flow...
  A browser window has been opened at https://flow.ciandt.com/login. Please continue the login in the web browser.
  Browser window has been closed, processing the login result...
  ✔ Email: xxx@ciandt.com
  ✔ Principal Tenant: CI&T Playground
  ✔ Active Tenant: CI&T Playground
  You have successfully logged in to CI&T Flow!
```

_See code: [src/commands/login.ts](https://github.com/nodite/citflow/blob/v0.0.0/src/commands/login.ts)_
<!-- commandsstop -->
