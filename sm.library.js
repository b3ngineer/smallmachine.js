var smallmachine = function(core) {
  Function.prototype.alsoBehavesLike = function(something) {
    for(var p in something.prototype) {
      if(p.indexOf("_") == 0) {
        continue
      }
      if(typeof this.prototype[p] !== "undefined") {
        continue
      }
      this.prototype[p] = something.prototype[p]
    }
    for(var p in something) {
      if(!something.hasOwnProperty(p)) {
        continue
      }
      if(p.indexOf("_") == 0) {
        continue
      }
      if(typeof this.prototype[p] !== "undefined") {
        continue
      }
      this.prototype[p] = something[p]
    }
  };
  core.CONCEPT = "concept";
  core.RELATIONSHIP = "relationship";
  core.AsyncResult = function(channel) {
    this._type = "AsyncResult";
    this._channel = channel;
    return this
  };
  core.AsyncResult.prototype.publish = function(message, recipients) {
    this._channel.publish(message, recipients)
  };
  var Channel = function() {
    return this
  };
  Channel.prototype.forward = function() {
    throw new Error("Missing implementation of forward");
  };
  Channel.prototype.subscribe = function(subscriber) {
    if(typeof this._subscribers === "undefined") {
      this._subscribers = []
    }
    if(typeof subscriber === "function") {
      this._subscribers.push({update:subscriber});
      return this
    }
    this._subscribers.push(subscriber);
    return this
  };
  var notify = function(message, subscribers) {
    var authoritative = false, delegates = [], deference = [];
    for(var i = 0;i < subscribers.length;i++) {
      var response = subscribers[i].update(message);
      if(response === true) {
        authoritative = true
      }else {
        if(typeof response === "function") {
          deference.push(response)
        }else {
          if(typeof response === "object" && typeof response.update === "function") {
            delegates.push(response.update)
          }
        }
      }
    }
    if(authoritative) {
      for(var i = 0;i < deference.length;i++) {
        deference[i](message)
      }
    }else {
      for(var i = 0;i < delegates.length;i++) {
        delegates[i](message)
      }
    }
  };
  Channel.prototype.publish = function(message, recipients) {
    var recipients = recipients || {};
    if(typeof message === "function") {
      var newResult = message(new core.AsyncResult(this));
      message = newResult;
      if(typeof message !== "undefined" && typeof message._type !== "undefined" && message._type === "AsyncResult") {
        return this
      }
    }
    if(typeof this._subscribers === "undefined") {
      this.forward(message, recipients);
      return this
    }
    notify(message, this._subscribers);
    this.forward(message, recipients);
    return this
  };
  Channel.prototype.addHelper = function(name, helper) {
    var method = Channel.prototype.publish;
    var context = this;
    this[name] = function() {
      var args = [];
      for(var i = 0;i < arguments.length;i++) {
        args.push(arguments[i])
      }
      return method.apply(context, [function(asyncResult) {
        args.push(asyncResult);
        return helper.apply(context, args)
      }])
    };
    return this
  };
  var Rules = function() {
    return this
  };
  Rules.prototype.isA = function(o) {
    throw new Error("Missing implementation for isA");
  };
  Rules.prototype.hasRange = function(o) {
    throw new Error("Missing implementation for hasRange");
  };
  Rules.prototype.hasDomain = function(o) {
    throw new Error("Missing implementation for hasDomain");
  };
  Rules.prototype.relatesTo = function(p, o) {
    throw new Error("Missing implementation for relatesTo");
  };
  core.Term = function(value) {
    if(typeof value._value !== "undefined" && typeof value._type !== "undefined") {
      this._value = value._value;
      this._type = value._type
    }else {
      this._value = value;
      this._type = null
    }
    return this
  };
  core.add = function(Term) {
    core[Term._value] = Term;
    return Term
  };
  core.Term.prototype.forward = function(message, recipients) {
    if(this._value != null) {
      recipients[this._value] = true
    }
    for(var property in this) {
      if(!this.hasOwnProperty(property)) {
        continue
      }
      if(typeof this[property] === "function" || property.indexOf("_") === 0) {
        continue
      }
      if(recipients[property] === true) {
        continue
      }
      if(typeof this[property].publish === "function") {
        recipients[property] = true;
        this[property].publish(message, recipients)
      }
    }
    if(typeof this._relatesTo !== "undefined") {
      for(var i = 0;i < this._relatesTo.length;i++) {
        if(typeof this._relatesTo[i]._subscribers === "undefined") {
          continue
        }
        notify(message, this._relatesTo[i]._subscribers)
      }
    }
  };
  core.Term.prototype.relatesTo = function(TermA, TermB) {
    if(TermA._type === core.CONCEPT) {
      throw new Error("Cannot define a relationship with a concept type: " + TermA._value);
    }else {
      if(TermA._type === null) {
        TermA._type = core.RELATIONSHIP
      }
    }
    if(TermB._type === core.RELATIONSHIP) {
      throw new Error("Cannot create a relationship with a relationship type: " + TermB._value);
    }else {
      if(TermB._type === null) {
        TermB._type = core.CONCEPT
      }
    }
    if(this._type === core.RELATIONSHIP) {
      throw new Error("Cannot create a relationship from a relationship type: " + this._value);
    }else {
      if(this._type === null) {
        this._type = core.CONCEPT
      }
    }
    core[this._value][TermA._value] = new core.Term(TermA);
    core[this._value][TermA._value][TermB._value] = TermB;
    core[this._value][TermB._value] = TermB;
    if(typeof TermB._relatesTo === "undefined") {
      TermB._relatesTo = []
    }
    TermB._relatesTo.push(core[this._value][TermA._value]);
    for(var field in TermB) {
      if(!TermB.hasOwnProperty(field)) {
        continue
      }
      if(typeof TermB[field] === "function" || field.indexOf("_") === 0) {
        continue
      }
      if(typeof TermB[field]._value === "undefined") {
        continue
      }
      core[this._value][TermA._value][field] = TermB[field];
      core[this._value][field] = TermB[field];
      if(typeof TermB[field]._relatesTo === "undefined") {
        TermB[field]._relatesTo = []
      }
      TermB[field]._relatesTo.push(core[this._value][TermA._value])
    }
    return this
  };
  core.Term.prototype.isA = function(Term) {
    if(Term._type === core.RELATIONSHIP) {
      throw new Error("Cannot apply isA to a relationship type: " + Term._value);
    }else {
      if(Term._type === null) {
        Term._type = core.CONCEPT
      }
    }
    if(this._type === core.RELATIONSHIP) {
      throw new Error("Cannot apply isA to a relationship type: " + this._value);
    }else {
      if(this._type === null) {
        this._type = core.CONCEPT
      }
    }
    core[Term._value][this._value] = this;
    return this
  };
  core.Term.prototype.hasRange = function(Term) {
    if(Term._type === core.RELATIONSHIP) {
      throw new Error("Cannot apply hasRange to a relationship type: " + Term._value);
    }else {
      if(Term._type === null) {
        Term._type = core.CONCEPT
      }
    }
    if(this._type === core.CONCEPT) {
      throw new Error("Cannot assign hasRange from a concept type: " + this._value);
    }else {
      if(this._type === null) {
        this._type = core.RELATIONSHIP
      }
    }
    core[this._value][Term._value] = Term;
    if(typeof Term._relatesTo === "undefined") {
      Term._relatesTo = []
    }
    Term._relatesTo.push(this);
    for(var field in Term) {
      if(!Term.hasOwnProperty(field)) {
        continue
      }
      if(typeof Term[field] === "function" || field.indexOf("_") === 0) {
        continue
      }
      if(typeof Term[field]._value === "undefined") {
        continue
      }
      core[this._value][Term[field]._value] = Term[field];
      if(typeof Term[field]._relatesTo === "undefined") {
        Term[field]._relatesTo = []
      }
      Term[field]._relatesTo.push(this)
    }
    return this
  };
  core.Term.prototype.hasDomain = function(Term) {
    if(Term._type === core.RELATIONSHIP) {
      throw new Error("Cannot apply hasRange to a relationship type: " + Term._value);
    }else {
      if(Term._type === null) {
        Term._type = core.CONCEPT
      }
    }
    if(this._type === core.CONCEPT) {
      throw new Error("Cannot assign hasRange from a concept type: " + this._value);
    }else {
      if(this._type === null) {
        this._type = core.RELATIONSHIP
      }
    }
    core[Term._value][this._value] = this;
    return this
  };
  core.Term.alsoBehavesLike(Channel);
  core.Term.alsoBehavesLike(Rules);
  return core
}(smallmachine || {});
(function(ontology) {
  ontology.add(new ontology.Term("thing"));
  ontology.add(new ontology.Term("user"));
  ontology.add(new ontology.Term("system"));
  ontology.add(new ontology.Term("action"));
  ontology.add(new ontology.Term("click"));
  ontology.add(new ontology.Term("doubleClick"));
  ontology.add(new ontology.Term("keyPress"));
  ontology.add(new ontology.Term("task"));
  ontology.add(new ontology.Term("initialize"));
  ontology.add(new ontology.Term("insert"));
  ontology.add(new ontology.Term("remove"));
  ontology.add(new ontology.Term("get"));
  ontology.add(new ontology.Term("set"));
  ontology.add(new ontology.Term("messenger"));
  ontology.add(new ontology.Term("success"));
  ontology.add(new ontology.Term("error"));
  ontology.add(new ontology.Term("performs"));
  ontology.add(new ontology.Term("reactsTo"));
  ontology.user.isA(ontology.thing);
  ontology.system.isA(ontology.thing);
  ontology.action.isA(ontology.thing);
  ontology.task.isA(ontology.thing);
  ontology.messenger.isA(ontology.thing);
  ontology.click.isA(ontology.action);
  ontology.doubleClick.isA(ontology.action);
  ontology.keyPress.isA(ontology.action);
  ontology.get.isA(ontology.task);
  ontology.set.isA(ontology.task);
  ontology.success.isA(ontology.messenger);
  ontology.error.isA(ontology.messenger);
  ontology.initialize.isA(ontology.task);
  ontology.insert.isA(ontology.task);
  ontology.remove.isA(ontology.task);
  ontology.performs.hasRange(ontology.action).hasRange(ontology.task);
  ontology.reactsTo.hasRange(ontology.action).hasDomain(ontology.system);
  ontology.user.relatesTo(ontology.performs, ontology.action);
  ontology.system.relatesTo(ontology.performs, ontology.task)
})(smallmachine);
(function(sm) {
  var jsonHelper = function(url, asyncResult) {
    if(typeof jQuery !== "undefined") {
      try {
        jQuery.ajax({dataType:"json", url:url, type:"GET", success:function(data, textStatus, jqxhr) {
          sm.messenger.success.publish(textStatus);
          asyncResult.publish(data)
        }, error:function(jqxhr, textStatus, thrown) {
          sm.messenger.error.publish(thrown)
        }})
      }catch(error) {
        sm.messenger.error.publish(error)
      }
    }else {
      var xhr = window.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("MSXML2.XMLHTTP.3.0");
      xhr.onprogress = function() {
      };
      xhr.onerror = {};
      xhr.onreadystatechange = function() {
        if(xhr.readyState < 4) {
          return
        }
        if(xhr.status == 200) {
          sm.messenger.success.publish(xhr.statusText);
          asyncResult.publish(JSON.parse(xhr.responseText))
        }else {
          sm.messenger.error.publish(xhr.statusText)
        }
      };
      xhr.open("GET", url, true);
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.send(null)
    }
    return asyncResult
  };
  sm.system.initialize.addHelper("json", jsonHelper)
})(smallmachine);
(function(sm) {
  function Hook(targetObject, contextObject) {
    this.target = targetObject;
    this.context = contextObject;
    return this
  }
  Hook.prototype.getType = function() {
    return"[object Hook]"
  };
  var hookHelper = function(targetObject, contextObject, asyncResult) {
    var hookObject = new Hook(targetObject, contextObject);
    return hookObject
  };
  sm.system.insert.addHelper("hook", hookHelper)
})(smallmachine);

