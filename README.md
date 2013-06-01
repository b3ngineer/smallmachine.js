# smallmachine.js #
----------

## Components ##
1. Client Assets
2. Server Assets
3. Repository Assets

### Client Assets ###
The client assets include:

1. A **feature implementation API** for sending and receiving application and server events (as opposed to DOM events, which are not handled by the core library).
2. A **reasoner** for establishing and executing rules of conduct between installed application features.
3. The ***smallmachine* core UI bones** for starting applications using an extensible radial menu driven interface.

### Server Assets ####
The server assets include:

1. A Node.js service to maintain user and application **feature subscriptions**.
2. A sample **administrator page** for making RESTful requests to a hosted *smallmachine* instance server.
3. A sample **rules builder page** for defining negotiations between features--with the functionality needed to test and upload the rules on a hosted  *smallmachine* instance server.

### Repository Assets ###
The repository assets include:

1. A Node.js service to **store and send feature assets**.
2. A sample **repository browser feature** for enabling users to peruse the list of available features in the repository.
3. A sample **voting feature** for enabling users to up or down vote features in the repository.
4. The ***smallmachine* core features** for driving basic mind-map and flowchart driven interfaces.