![Node.js CI](https://github.com/stelescuraul/dependecy-viewer/workflows/Node.js%20CI/badge.svg?branch=master)
> Dependency viewer across nodejs projects

- [1. Support](#1-support)
- [2. Install](#2-install)
- [3. Usage](#3-usage)
- [4. API](#4-api)

# 1. Support
Currently the project has support for:
- [x] Gitlab
- [ ] Github
- [ ] Bitbucket

# 2. Install
> npm install dependency-viewer

# 3. Usage
```javascript
const Gitlab = require('./lib/wrappers/Gitlab');
const GraphBuilder = require('./lib/GraphBuilder');

const gitlab = new Gitlab('organization', { token: 'super-secret-token' });
const graphBuilder = new GraphBuilder(gitlab);

graphBuilder.buildDependencyGraph({
  wrapperOptions: {
    excludeProjects: [],
    packageInclude: '',
    packagePrefix: '',
  },
}).then(async (dependencyGraphs) => {
  // do something with your dependecy graphs
});
```

# 4. API
## Classes

<dl>
<dt><a href="#GraphBuilder">GraphBuilder</a></dt>
<dd><p>GraphBuilder
builds the dependency graph given a wrapper</p>
</dd>
<dt><a href="#GitlabWrapper">GitlabWrapper</a></dt>
<dd><p>GitlabWrapper
implements all the communication with Gitlab api</p>
</dd>
<dt><a href="#Wrapper">Wrapper</a></dt>
<dd><p>Wrapper
extend it when implementing a Wrapper</p>
</dd>
</dl>

<a name="GraphBuilder"></a>

## GraphBuilder
GraphBuilder
builds the dependency graph given a wrapper

[GraphBuilder](#GraphBuilder)
   * [new GraphBuilder(wrapper)](#new_GraphBuilder_new)
   * [.buildDependencyGraph(wrapperOptions)](#GraphBuilder+buildDependencyGraph) ⇒ <code>Object</code>

<a name="new_GraphBuilder_new"></a>

### new GraphBuilder(wrapper)
Create new GraphBuilder


| Param | Type |
| --- | --- |
| wrapper | [<code>Wrapper</code>](#Wrapper) |

<a name="GraphBuilder+buildDependencyGraph"></a>

### graphBuilder.buildDependencyGraph(wrapperOptions) ⇒ <code>Object</code>
build the dependency graph

**Kind**: instance method of [<code>GraphBuilder</code>](#GraphBuilder)

**Returns**: <code>Object</code> - all dependencies {allDepsGraph, proDepsGraph, devDepsGraph }

| Param | Type |
| --- | --- |
| wrapperOptions | <code>Object</code> |

----

<a name="GitlabWrapper"></a>

## GitlabWrapper
GitlabWrapper
implements all the communication with Gitlab api

[GitlabWrapper](#GitlabWrapper)
   * [new GitlabWrapper([organization], options)](#new_GitlabWrapper_new)
   * [.getAllPackages(options)](#GitlabWrapper+getAllPackages) ⇒ <code>Object</code>

<a name="new_GitlabWrapper_new"></a>

### new GitlabWrapper([organization], options)
Create new GitlabWrapper


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [organization] | <code>String</code> | <code>&#x27;&#x27;</code> | name of organization |
| options | <code>Object</code> |  | options object |
| [options.protocol] | <code>String</code> | <code>https</code> | protocol to be used |
| [options.domain] | <code>String</code> | <code>gitlab.com</code> | domain to be used |
| options.token | <code>String</code> |  | token from Gitlab |

<a name="GitlabWrapper+getAllPackages"></a>

### gitlabWrapper.getAllPackages(options) ⇒ <code>Object</code>
Get all package.json from gitlab projects

**Kind**: instance method of [<code>GitlabWrapper</code>](#GitlabWrapper)

**Returns**: <code>Object</code> - All dependencies objects

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | options object |
| [options.excludeProjects] | <code>Array.&lt;String&gt;</code> | <code>[]</code> | array of strings representing projects to exclude |
| [options.packagePrefix] | <code>String</code> | <code>&#x27;&#x27;</code> | inlcude packages that have this prefix in their name. Useful for organization packages |
| [options.packageInclude] | <code>String</code> | <code>&#x27;&#x27;</code> | include packages that contain this this in their name |

---

<a name="Wrapper"></a>

## Wrapper
Wrapper
extend it when implementing a Wrapper

<a name="Wrapper+getAllPackages"></a>

### wrapper.getAllPackages(options)
**Kind**: instance method of [<code>Wrapper</code>](#Wrapper)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | options object |
| options.excludeProjects | <code>Array.&lt;String&gt;</code> | array of strings representing projects to exclude |
| options.packagePrefix | <code>String</code> | inlcude packages that have this prefix in their name. Useful for organization packages |
| options.packageInclude | <code>String</code> | include packages that contain this this in their name |

