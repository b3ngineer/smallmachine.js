;(function(sm, sammy) {
	function StateQueryModel(app) {
		this.searchModel = {};
		
		var helpers = {
			addDataModel : function(model) {
				this.searchModel = model;
			},
			isEqualWordId : function(a,b) {
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
			},
			getNumberId : function(number) {
				var numbers = this.searchModel.words[0].length,
				 	low = 0,
					high = numbers - 1,
					mid = Math.floor(numbers / 2);
				while (high >= low) {
					var found = this.searchModel.words[0][mid];
					if (number === found) {
						return [0, mid];
					}
					if (number < found) {
						high = mid - 1;
					} else {
						low = mid + 1;
					}
					mid = Math.floor((low + high) / 2);
				}
				return false;
			},
			getWordId : function(word) {
				if (typeof word === 'number') {
					return this.getNumberId(word);
				}
				var w = word.toString(),
				 	l = w.length;
				if (!this.searchModel.words[l]) {
					return false;
				}
				var words = this.searchModel.words[l].length / l,
					low = 0,
					high = words - 1,
					mid = Math.floor(words/2);
				while (high >= low) {
					var idx = l * mid;
					var found = this.searchModel.words[l].substr(idx, l);
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
			}
		};

		if (typeof this.helpers === 'function') {
			this.helpers(helpers);
		}
		else {
			this.addDataModel = helpers.addDataModel;
			this.getWordId = helpers.getWordId;
			this.getNumberId = helpers.getNumberId;
			this.isEqualWordId = helpers.isEqualWordId;
		}
	};
	StateQueryModel.prototype._name = 'StateQueryModel';
	sm.type.extendedBy(StateQueryModel);
}(smallmachine, Sammy));
