;(function(sm, sammy) {
	function StateQueryModel(app) {

		var EQUAL = 0,
			GREATER_THAN_OR_EQUAL = 1,
			GREATER_THAN = 2,
			LESS_THAN_OR_EQUAL = -1,
			LESS_THAN = -2;

		var OPERATORS = {
			equal : EQUAL,
			greaterThanOrEqual : GREATER_THAN_OR_EQUAL,
			greaterThan : GREATER_THAN,
			lessThanOrEqual : LESS_THAN_OR_EQUAL,
			lessThan : LESS_THAN
		};

		function SearchModel() {
			this._terms = [];
			this._terms[0] = [];
			this._rules = [];
			this._conflictStrategy = null;
		};

		SearchModel.prototype._name = 'SearchModel';

		SearchModel.prototype._numberExists = function(term) {
			var numbers = this._terms[0].length,
				low = 0,
				high = numbers - 1,
				mid = Math.floor(numbers / 2);

			while (high >= low) {
				var found = this._terms[0][mid];
				if (term === found) {
					return true;
				}

				if (term < found) {
					high = mid - 1;
				}
				else {
					low = mid + 1;
				}
				mid = Math.floor((low + high) / 2);
			}
			return false;
		};

		SearchModel.prototype.addTerm = function(term) {
			if (typeof term === 'number') {
				if (this._numberExists(term)) {
					return;
				}
				this._terms[0].push(term);
				this._terms[0].sort();
				return;
			}

			var word = term.toString(),
				l = word.length;

			if (typeof this._terms[l] === 'undefined') {
				this._terms[l] = word;
				return;
			}

			if (this._terms[l].indexOf(word) > -1) {
				return;
			}

			var num = this._terms[l].length / l,
				terms = [word];

			for (var i = 0; i < num; i++) {
				terms.push(this._terms[l].substring(i*l, i*l+l));
			}
			terms.sort();
			this._terms[l] = terms.join('');
		};

		SearchModel.prototype.addRules = function(rules) {
			for (var i = 0, rulesLength = rules.length; i < rulesLength; i++) {
				for (var j = 0, ruleTermsLength = rules[i].terms.length; j < ruleTermsLength; j++) {
					var t = rules[i].terms[j];
					this.addTerm(t);
				}
			}

			// "compile" rules now that all terms have been reduced to indexed strings
			for (var i = 0, rulesLength = rules.length; i < rulesLength; i++) {
				var rule = [],
					ruleTermsLength = rules[i].terms.length,
					highestGroupIndex = 0;

				for (var j = 0;j < ruleTermsLength; j++) {
					var t = rules[i].terms[j],
						termId = this.getTermId(t),
						groupIndex = termId[0],
						matchIndex = termId[1];

					if (groupIndex > highestGroupIndex) {
						highestGroupIndex = groupIndex;
					}

					if (typeof rule[groupIndex] === 'undefined') {
						rule[groupIndex] = [];
					}

					rule[groupIndex][matchIndex] = termId;
					if (typeof rules[i].operators !== 'undefined'
						&& typeof rules[i].operators[j] != 'undefined') {
						var knownOperator = OPERATORS[rules[i].operators[j].toString()];
						if (typeof knownOperator !== 'undefined') {
							rule[groupIndex][matchIndex][2] = knownOperator;
						}
						else {
							rule[groupIndex][matchIndex][2] = rules[i].operators[j];
						}
					}
					else {
						rule[groupIndex][matchIndex][2] = 0;
					}
				}

				rule[highestGroupIndex + 1] = ruleTermsLength; // append true term count as condition count
				rule[highestGroupIndex + 2] = rules[i].action; // action is tail end of any rule
				this._rules.push(rule);
			}
		};

		SearchModel.prototype.getNumberId = function(term) {
			var numbers = this._terms[0].length,
				low = 0,
				high = numbers - 1,
				mid = Math.floor(numbers / 2);

			while (high >= low) {
				var found = this._terms[0][mid];
				if (term === found) {
					return [0, mid];
				}
				if (term < found) {
					high = mid - 1;
				}
				else {
					low = mid + 1;
				}
				mid = Math.floor((low + high) / 2);
			}
			return false;
		};

		SearchModel.prototype.getTermId = function(term) {
			if (typeof term === 'number') {
				return this.getNumberId(term);
			}

			var w = term.toString(),
				l = w.length;
			
			if (!this._terms[l]) {
				return false;
			}

			var terms = this._terms[l].length / l,
				low = 0,
				high = terms - 1,
				mid = Math.floor(terms/2);

			while (high >= low) {
				var idx = l * mid;
				var found = this._terms[l].substr(idx, l);
				if (w === found) {
					return [l, idx / l];
				}
				if (w < found) {
					high = mid - 1;
				} else {
					low = mid + 1;
				}
				mid = Math.floor((low + high) / 2);
			}
			return false;
		};

		SearchModel.prototype.isEqualTermId = function(a,b) {
			if (!a || !b) {
				return false;
			}
			if (a.length !== b.length) {
				return false;
			}
			for (var i = 0; i < a.length; i++) {
				if (a[i] !== b[i]) {
					return false;
				}
			}
			return true;
		};

		SearchModel.prototype.executeQuery = function(state) {
			var matchingRules = [],
				agenda = [];

			for (var i = 0, stateLength = state.length; i < stateLength; i++) {
				var t = this.getTermId(state[i]);

				for (var j = 0, rulesLength = this._rules.length; j < rulesLength; j++) {
					if (typeof matchingRules[j] === 'undefined') {
						matchingRules[j] = 0;
					}
					else if (matchingRules[j] === false) {
						continue;
					}

					var groupNumber = t[0],
						groupIndex = t[1],
						group = this._rules[j][groupNumber];

					if (typeof group === 'undefined'
						|| typeof group[groupIndex] === 'undefined'
						|| !(group[groupIndex] instanceof Array)) {
						matchingRules[j] = false; // MISS (this rule can never be true until state changes)
						continue;
					}

					matchingRules[j]++;
				}
			}

			for (var i = 0, matchingRulesLength = matchingRules.length; i < matchingRulesLength; i++) {
				var size = this._rules[i].length,
					groupCount = this._rules[i][size - 2];

				if (matchingRules[i] === groupCount) {
					agenda.push(this._rules[i][size - 1]);
				}
			}

			if (typeof this._conflictStrategy === 'function') {
				this._conflictStrategy(agenda);
			}

			return agenda;
		};

		this.searchModel = new SearchModel();

		var api = {
			addDataModel : function(model) {
				if (typeof model._terms !== 'undefined' && model._terms.length > 0
				    && typeof model._rules !== 'undefined' && model._rules.length > 0) {
					// "pre-compiled" rules incoming
					this.searchModel._terms = model._terms;
					this.searchModel._rules = model._rules;
				}
				else {
					this.searchModel.addRules(model.rules);
				}
				this.searchModel._conflictStrategy = model.conflictStrategy;
			},
			isEqualTermId : function(a,b) { // primarily for testing purposes
				return this.searchModel.isEqualTermId(a,b);
			},
			getNumberId : function(term) { // primarily for testing purposes
				return this.searchModel.getNumberId(term);
			},
			getTermId : function(term) { // primarily for testing purposes
				return this.searchModel.getTermId(term);
			},
			executeQuery : function(state) {
				return this.searchModel.executeQuery(state);
			}
		};

		if (typeof this.helpers === 'function') {
			this.helpers(api);
		}
		else {
			this.addDataModel = api.addDataModel;
			this.getTermId = api.getTermId;
			this.getNumberId = api.getNumberId;
			this.isEqualTermId = api.isEqualTermId;
			this.executeQuery = api.executeQuery;
		}
	};

	StateQueryModel.prototype._name = 'StateQueryModel';
	sm.type.extendedBy(StateQueryModel);
}(smallmachine, Sammy));
