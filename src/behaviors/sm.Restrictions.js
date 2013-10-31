;(function(sm) {
    'use strict';

	function Collection() {
		this.length = 0;
		this._max = -1;
		this._min = -1;
		return this;
	}

	Collection.prototype.add = function(key, value) {
		if (typeof this[key] === 'undefined') {
			if (this._max > 0 && this._max < this.length + 1) {
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

	function Restrictions() {
		return this;
	};

	Restrictions.prototype._name = 'Restrictions';

	/* if a Term has a max restricition, it must be a collection */
	Restrictions.prototype.max = function(maximumLength) {
		if (typeof this._collection === 'undefined') {
			this._collection = new Collection();
		}
		this._collection._max = maximumLength;
	};

	Restrictions.prototype.add = function(key, value) {
		if (typeof this._collection === 'undefined') {
			this._collection = new Collection();
		}
		this._collection.add(key, value);
	};

	Restrictions.prototype.min = function(minimumLength) {
		if (typeof this._collection === 'undefined') {
			this._collection = new Collection();
		}
		this._collection._min = minimumLength;
	};

	sm.behavior.extendedBy(Restrictions);
}(smallmachine));
