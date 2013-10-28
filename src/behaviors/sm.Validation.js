;(function(sm) {
    'use strict';

	function Collection() {
		this.length = 0;
		this._max = -1;
		return this;
	}

	Collection.prototype.add = function(key, value) {
		if (typeof this[key] === 'undefined') {
			if (this._max < this.length + 1) {
				sm.error(new Error('The maximum number of items already exists in this collection (max ' + this._max + ')'));
			}
			this[key] = value;
			this.length++;
		}
		else {
			sm.error(new Error('Cannot add an item to a collection when it\'s key has already present: ' + key));
		}
	};

	Collection.prototype.exists = function(key) {
		return typeof this[key] !== 'undefined';
	};

	Collection.prototype.remove = function(key) {
		if (typeof this[key] !== 'undefined') {
			delete this[key];
			this.length--;
		}
		else {
			sm.error(new Error('An item with the specified key has not been added: ' + key));
		}
	};

	function Validation() {
		return this;
	};

	Validation.prototype._name = 'Validation';

	/* if a Term has a max restricition, it must be a collection */
	Validation.prototype.max = function(maximumLength) {
		if (typeof this._collection === 'undefined') {
			this._collection = new Collection();
		}
		this._collection._max = maximumLength;
	};

	Validation.prototype.add = function(key, value) {
		if (typeof this._collection === 'undefined') {
			this._collection = new Collection();
		}
		this._collection.add(key, value);
	};

	sm.behavior.extendedBy(Validation);
}(smallmachine));
