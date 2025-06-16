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
* [`citflow openapi`](#citflow-openapi)
* [`citflow openapi codegen`](#citflow-openapi-codegen)
* [`citflow user set`](#citflow-user-set)

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
  $ citflow login --service global-settings|user-api|login-service|knowledge-api|auth-engine-api|all
    [--channel portal]

FLAGS
  --channel=<option>  [default: portal] The channel through which the request is made, affecting the resulting URL.
                      <options: portal>
  --service=<option>  (required) The service to preview the OpenAPI schema for.
                      <options: global-settings|user-api|login-service|knowledge-api|auth-engine-api|all>

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

## `citflow openapi`

OpenAPI schema preview

```
USAGE
  $ citflow openapi --service global-settings|user-api|login-service|knowledge-api|auth-engine-api|all

FLAGS
  --service=<option>  (required) The service to preview the OpenAPI schema for.
                      <options: global-settings|user-api|login-service|knowledge-api|auth-engine-api|all>

DESCRIPTION
  OpenAPI schema preview

EXAMPLES
  $ citflow openapi index --service login-service
  Preview the OpenAPI schema for the login service
```

_See code: [src/commands/openapi/index.ts](https://github.com/nodite/citflow/blob/v0.0.0/src/commands/openapi/index.ts)_

## `citflow openapi codegen`

OpenAPI code generation

```
USAGE
  $ citflow openapi codegen --service global-settings|user-api|login-service|knowledge-api|auth-engine-api|all

FLAGS
  --service=<option>  (required) The service to preview the OpenAPI schema for.
                      <options: global-settings|user-api|login-service|knowledge-api|auth-engine-api|all>

DESCRIPTION
  OpenAPI code generation

EXAMPLES
  $ citflow openapi:codegen --service global-settings
  Generating code for service: global-settings
  Code generation for service global-settings completed successfully.
  ----------------------------------------
```

_See code: [src/commands/openapi/codegen.ts](https://github.com/nodite/citflow/blob/v0.0.0/src/commands/openapi/codegen.ts)_

## `citflow user set`

Set a default account from the list of authenticated accounts.

```
USAGE
  $ citflow user set [--email <value>]

FLAGS
  --email=<value>  The email of the account to set as default.

DESCRIPTION
  Set a default account from the list of authenticated accounts.

EXAMPLES
  $ citflow user set
  Only one authenticated account found. Setting email:xxx@ciandt.com as default.
  Default account set to email:xxx@ciandt.com.

  $ citflow user set --email xxx@ciandt.com
  Setting email:xxx@ciandt.com as default.
  Default account set to email:xxx@ciandt.com.
```

_See code: [src/commands/user/set.ts](https://github.com/nodite/citflow/blob/v0.0.0/src/commands/user/set.ts)_
<!-- commandsstop -->
