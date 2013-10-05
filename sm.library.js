var smallmachine = function(core) {
  if(typeof Object.getPrototypeOf !== "function") {
    if(typeof"test".__proto__ === "object") {
      Object.getPrototypeOf = function(object) {
        return object.__proto__
      }
    }else {
      Object.getPrototypeOf = function(object) {
        return object.constructor.prototype
      }
    }
  }
  core = function(ontologies, behaviors) {
    if(typeof ontologies === "undefined") {
      throw new Error("Missing required parameter for smallmachine constructor: one or more instances of type [object Ontology]");
    }
    var allOntologies = [].concat(ontologies);
    if(allOntologies.length === 1) {
      return allOntologies[0].getModel(behaviors)
    }
    var ontology = new core.Ontology(allOntologies[0].title);
    for(var i = 0;i < allOntologies.length;i++) {
      for(var p in allOntologies[i]) {
        if(!allOntologies[i].hasOwnProperty(p)) {
          continue
        }
        if(typeof allOntologies[i][p].ofType === "function" && allOntologies[i][p].ofType("Proxy")) {
          var term = allOntologies[i][p]._term;
          ontology.addTerm(term._value)
        }
      }
      for(var j = 0;j < allOntologies[i]._inferencer._rules.length;j++) {
        ontology._inferencer._rules.push(allOntologies[i]._inferencer._rules[j])
      }
      for(var j = 0;j < allOntologies[i]._activators.length;j++) {
        ontology.registerActivator(allOntologies[i]._activators[j])
      }
    }
    return ontology.getModel(behaviors)
  };
  core.alsoBehavesLike = function(a, b) {
    for(var p in b) {
      if(!b.hasOwnProperty(p)) {
        continue
      }
      if(p.indexOf("_") == 0) {
        continue
      }
      if(typeof a[p] !== "undefined") {
        var currentBehaviorIsVirtual = typeof a[p].prototype !== "undefined" ? a[p].prototype.virtual : false;
        var newBehaviorIsVirtual = typeof b[p].prototype !== "undefined" ? b[p].prototype.virtual : false;
        if(currentBehaviorIsVirtual && newBehaviorIsVirtual) {
          continue
        }else {
          if(currentBehaviorIsVirtual) {
            a[p] = b[p];
            continue
          }else {
            if(newBehaviorIsVirtual) {
              continue
            }
          }
        }
      }else {
        a[p] = b[p]
      }
    }
    if(typeof b.prototype !== "undefined") {
      if(typeof a.prototype === "undefined") {
        a.prototype = {}
      }
      core.alsoBehavesLike(a.prototype, b.prototype)
    }
  };
  core.CONCEPT = "concept";
  core.RELATIONSHIP = "relationship";
  var Proxy = function(Term, Inferencer) {
    this._term = Term;
    this._rules = Inferencer._rules;
    return this
  };
  Proxy.prototype.getType = function() {
    return"[object Proxy]"
  };
  Proxy.prototype.ofType = function(type) {
    return type === "Proxy" || typeof type.getType === "function" && type.getType() === this.getType()
  };
  var _Term = function() {
    return this
  };
  _Term.prototype.relate = function(Term) {
    if(typeof this._relatesTo === "undefined") {
      this._relatesTo = []
    }
    var alreadyRelatesTo = false;
    for(var i = 0;i < this._relatesTo.length;i++) {
      if(this._relatesTo[i]._id == Term._id) {
        alreadyRelatesTo = true;
        break
      }
    }
    if(!alreadyRelatesTo) {
      this._relatesTo.push(Term)
    }
  };
  _Term.prototype.getType = function() {
    return"[object Term]"
  };
  _Term.prototype.ofType = function(type) {
    return type === "Term" || typeof type.getType === "function" && type.getType() === this.getType()
  };
  core.Behavior = function(title) {
    this.title = title;
    return this
  };
  core.Ontology = function(title) {
    this.title = title;
    this._inferencer = new Inferencer;
    this._activators = [];
    this._term = function(value) {
      this._id = function() {
        return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == "x" ? r : r & 3 | 8;
          return v.toString(16)
        })
      }();
      if(typeof value._value !== "undefined" && typeof value._type !== "undefined") {
        this._value = value._value;
        this._type = value._type
      }else {
        this._value = value;
        this._type = null
      }
      return this
    };
    return this
  };
  core.Ontology.prototype.getType = function() {
    return"[object Ontology]"
  };
  core.Ontology.prototype.addTerm = function(value) {
    if(typeof this[value] !== "undefined") {
      return this
    }
    var Term = this._term;
    Term.prototype.relate = _Term.prototype.relate;
    Term.prototype.getType = _Term.prototype.getType;
    Term.prototype.ofType = _Term.prototype.ofType;
    var t = new Term(value);
    this[value] = new Proxy(t, this._inferencer);
    return this
  };
  core.Ontology.prototype.registerActivator = function(activator) {
    this._activators.push(activator)
  };
  core.Ontology.prototype.getModel = function(behaviors) {
    var Model = function(title) {
      return this
    };
    var model = new Model;
    for(var p in this) {
      if(!this.hasOwnProperty(p)) {
        continue
      }
      if(typeof this[p] === "undefined" || this[p]._term === "undefined") {
        continue
      }
      if(p.indexOf("_") === 0) {
        continue
      }
      if(typeof this[p]._term !== "undefined") {
        model[p] = this[p]._term;
        if(typeof behaviors !== "undefined") {
          core.alsoBehavesLike(Object.getPrototypeOf(model[p]), behaviors.prototype)
        }
      }else {
        model[p] = this[p]
      }
    }
    this._inferencer._rules.sort(function(a, b) {
      return a._priority - b._priority
    });
    for(var i = 0;i < this._inferencer._rules.length;i++) {
      var rule = this._inferencer._rules[i];
      rule._fn.apply(model, rule._args)
    }
    for(var i = 0;i < this._activators.length;i++) {
      this._activators[i](model)
    }
    return model
  };
  var Inferencer = function() {
    this._term = {_value:null};
    this._rules = [];
    return this
  };
  var Rule = function(priority, fn, args) {
    this._fn = fn;
    this._args = args;
    this._priority = priority;
    return this
  };
  Inferencer.prototype.isA = function(Proxy) {
    this._rules.push(new Rule(1, isA, [this._term._value, Proxy._term._value]));
    return this
  };
  Inferencer.prototype.relatesTo = function(ProxyA, ProxyB) {
    this._rules.push(new Rule(10, relatesTo, [this._term._value, ProxyA._term._value, ProxyB._term._value]));
    return this
  };
  Inferencer.prototype.hasDomain = function(Proxy) {
    this._rules.push(new Rule(3, hasDomain, [this._term._value, Proxy._term._value]));
    return this
  };
  Inferencer.prototype.hasRange = function(Proxy) {
    this._rules.push(new Rule(2, hasRange, [this._term._value, Proxy._term._value]));
    return this
  };
  core.alsoBehavesLike(Proxy, Inferencer);
  var relatesTo = function(target, termA, termB) {
    var Term = this[target];
    var TermA = this[termA];
    var TermB = this[termB];
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
    if(Term._type === core.RELATIONSHIP) {
      throw new Error("Cannot create a relationship from a relationship type: " + Term._value);
    }else {
      if(Term._type === null) {
        Term._type = core.CONCEPT
      }
    }
    if(typeof Term[termA] === "undefined") {
      var ctor = Term.constructor;
      Term[termA] = new ctor(TermA)
    }
    if(typeof Term[termA][termB] === "undefined") {
      Term[termA][termB] = TermB
    }
    if(typeof Term[termB] === "undefined") {
      Term[termB] = TermB
    }
    TermB.relate(Term[termA]);
    for(var field in TermB) {
      if(!TermB.hasOwnProperty(field)) {
        continue
      }
      if(TermB[field].getType && TermB[field].getType() === "[object Term]") {
        if(typeof Term[termA][field] === "undefined") {
          Term[termA][field] = TermB[field]
        }
        if(typeof Term[field] === "undefined") {
          Term[field] = TermB[field]
        }
        TermB[field].relate(Term[termA])
      }
    }
  };
  var isA = function(target, termA) {
    var Term = this[target];
    var TermA = this[termA];
    if(TermA._type === core.RELATIONSHIP) {
      throw new Error("Cannot apply isA to a relationship type: " + TermA._value);
    }else {
      if(TermA._type === null) {
        TermA._type = core.CONCEPT
      }
    }
    if(Term._type === core.RELATIONSHIP) {
      throw new Error("Cannot apply isA to a relationship type: " + Term._value);
    }else {
      if(Term._type === null) {
        Term._type = core.CONCEPT
      }
    }
    if(typeof TermA[target] === "undefined") {
      TermA[target] = Term
    }
  };
  var hasRange = function(target, termA) {
    var Term = this[target];
    var TermA = this[termA];
    if(TermA._type === core.RELATIONSHIP) {
      throw new Error("Cannot apply hasRange to a relationship type: " + TermA._value);
    }else {
      if(TermA._type === null) {
        TermA._type = core.CONCEPT
      }
    }
    if(Term._type === core.CONCEPT) {
      throw new Error("Cannot assign hasRange from a concept type: " + Term._value);
    }else {
      if(Term._type === null) {
        Term._type = core.RELATIONSHIP
      }
    }
    if(typeof Term[termA] === "undefined") {
      Term[termA] = TermA
    }
    TermA.relate(Term);
    for(var field in TermA) {
      if(!TermA.hasOwnProperty(field)) {
        continue
      }
      if(TermA[field].getType && TermA[field].getType() === "[object Term]") {
        var term = TermA[field]._value;
        if(typeof Term[term] === "undefined") {
          Term[term] = TermA[field]
        }
        TermA[field].relate(Term)
      }
    }
  };
  var hasDomain = function(target, termA) {
    var Term = this[target];
    var TermA = this[termA];
    if(TermA._type === core.RELATIONSIP) {
      throw new Error("Cannot apply hasRange to a relationship type: " + TermA._value);
    }else {
      if(TermA._type === null) {
        TermA._type = core.CONCEPT
      }
    }
    if(Term._type === core.CONCEPT) {
      throw new Error("Cannot assign hasRange from a concept type: " + Term._value);
    }else {
      if(Term._type === null) {
        Term._type = core.RELATIONSHIP
      }
    }
    if(typeof TermA[target] === "undefined") {
      TermA[target] = Term
    }
  };
  return core
}(smallmachine || {});
(function(sm) {
  var o = new sm.Ontology("sm.properties");
  o.addTerm("property");
  o.addTerm("type");
  o.addTerm("ontology");
  o.addTerm("behavior");
  o.addTerm("hasMemberType");
  o.addTerm("hasMember");
  o.addTerm("Ontology");
  o.addTerm("Behavior");
  o.addTerm("Constructor");
  o.addTerm("Null");
  o.ontology.isA(o.property);
  o.behavior.isA(o.property);
  o.Ontology.isA(o.type);
  o.Behavior.isA(o.type);
  o.Constructor.isA(o.type);
  o.Null.isA(o.type);
  o.ontology.relatesTo(o.hasMemberType, o.Ontology);
  o.behavior.relatesTo(o.hasMemberType, o.Behavior);
  o.ontology.relatesTo(o.hasMember, o.Null);
  o.behavior.relatesTo(o.hasMember, o.Null);
  var TypeExtender = function() {
    return this
  };
  TypeExtender.prototype.extendedBy = function(model, typeName) {
    if(typeof typeName !== "undefined" && typeof model === "function") {
      if(typeof this[typeName] !== "undefined") {
        sm.alsoBehavesLike(this[typeName], model)
      }else {
        this[typeName] = model
      }
      if(typeof this[typeName].prototype.getType !== "function") {
        this[typeName].prototype.getType = function() {
          return"[object " + typeName + "]"
        }
      }
      if(typeof this[typeName].prototype.ofType !== "function") {
        this[typeName].prototype.ofType = function(type) {
          if(typeof type.getType === "function") {
            return this.getType() === type.getType()
          }
          return this.getType() === "[object " + type + "]"
        }
      }
      return
    }
    if(typeof model.title === "undefined") {
      throw new Error("Cannot extendedBy the core ontology with model that is missing the 'title' property");
    }
    if(typeof this[model.title] !== "undefined") {
      sm.alsoBehavesLike(this[model.title], model);
      return
    }
    var typeConcept = this.hasMemberType;
    if(typeof typeConcept === "undefined" || typeof typeConcept.getType === "undefined") {
      throw new Error("The specified concept does not have a valid 'hasMemberType' relationship with another concept");
    }
    var hasMemberType = sm[this._value][typeConcept._value];
    if(typeof hasMemberType === "undefined") {
      throw new Error("The specified type does not exist in the core object model: " + typeConcept._value);
    }
    if(typeof model.getType !== "function") {
      throw new Error("The specified model is missing the getType function: " + model.title);
    }
    var modelType = model.getType();
    var validModelType = false;
    for(var t in hasMemberType) {
      if(!hasMemberType.hasOwnProperty(t)) {
        continue
      }
      if(typeof this[t].getType === "undefined") {
        continue
      }
      var comparison = "[object " + t + "]";
      if(comparison === modelType) {
        this.hasMember[model.title] = model;
        this[model.title] = model;
        validModelType = true;
        break
      }
    }
    if(!validModelType) {
      throw new Error("Did not find an allowed model type for: " + modelType);
    }
  };
  var Null = function() {
    this.title = "Null";
    return this
  };
  Null.prototype.getType = function() {
    return"[object Null]"
  };
  Null.prototype.ofType = function(type) {
    if(type === null || type === "null" || type === "Null") {
      return true
    }
    return false
  };
  sm.alsoBehavesLike(sm, o.getModel(TypeExtender));
  sm.ontology.extendedBy(new Null);
  sm.behavior.extendedBy(new Null);
  var AsyncResult = function(channel) {
    this._channel = channel;
    return this
  };
  AsyncResult.prototype.publish = function(message, recipients) {
    this._channel.publish(message, recipients);
    return this
  };
  sm.type.extendedBy(AsyncResult, "AsyncResult")
})(smallmachine);

