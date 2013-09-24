describe('sm.core', function() {

	describe('sanity', function() {
		var A = function() {
			return this;
		};

		var B = function() {
			this._value = false;
			this.value = true;
			return this;
		};

		B.prototype.test = function() {
			return false;
		};

		B.prototype.test.prototype.virtual = true;

		var C = function() {
			return true;
		};

		C.prototype.test = function() {
			return true;
		};

		smallmachine.alsoBehavesLike(A,B);
		smallmachine.alsoBehavesLike(B,C);

		it('should add message types to the target.type namespace', function() {
			smallmachine.addMessageType('Test1', function() { return this; });
			expect(smallmachine.types.Test1).toBeDefined();
			delete smallmachine.types.Test1;
		});

		it('should copy prototype functions when adding a message type', function() {
			var Test2 = function() {
				return this;
			};
			Test2.prototype.test = function() {
				return true;
			};
			smallmachine.addMessageType('Test2', Test2);
			expect(typeof smallmachine.types.Test2.prototype.test).toBe('function');
			delete smallmachine.types.Test2;
		});

		it('should create member functions on message type instances', function() {
			var Test3 = function() {
				return this;
			};
			Test3.prototype.test = function() {
				return true;
			};
			smallmachine.addMessageType('Test3', Test3);
			var testType = new smallmachine.types.Test3();
			expect(testType.test()).toBe(true);
			delete smallmachine.types.Test3;
		});

		it('should allow the use of instanceof to test an instance\'s type', function() {
			var Test4 = function() {
				return this;
			};
			smallmachine.addMessageType('Test4', Test4);
			var testType = new smallmachine.types.Test4();
			expect(testType instanceof smallmachine.types.Test4).toBe(true);
			delete smallmachine.types.Test4;
		});

		it('should merge prototype methods of two message types when added with the same name', function() {
			var TestA = function() {
				this.propertyA = true;
				return this;
			};

			TestA.prototype.methodA = function() {
				return true;
			};

			var TestB = function() {
				this.propertyB = true;
				return this;
			};

			TestB.prototype.methodB = function() {
				return true;
			};

			smallmachine.addMessageType('Test', TestA);
			smallmachine.addMessageType('Test', TestB);
			expect(smallmachine.types.Test.prototype.methodA).toBeDefined();
			expect(smallmachine.types.Test.prototype.methodB).toBeDefined();
			delete smallmachine.types.Test;
		});

		it('should allow truthful comparison of types after merge', function() {
			var TestA = function() {
				this.propertyA = true;
				return this;
			};

			var TestB = function() {
				return this;
			};

			smallmachine.addMessageType('Test', TestA);
			smallmachine.addMessageType('Test', TestB);
			var test = new smallmachine.types.Test();
			expect(test.ofType('Test')).toBe(true);
			expect(test.getType()).toBe('[object Test]');
			expect(test instanceof smallmachine.types.Test).toBe(true);
			delete smallmachine.types.Test;
		});

        it('should allow comparing instanceof AsyncResult from modules outside of core', function() {
            var test = new smallmachine.types.AsyncResult();
            expect(test instanceof smallmachine.types.AsyncResult).toBe(true);
        });

		it('should create the smallmachine constructor as a function', function() {
			expect(typeof smallmachine).toBe('function');
		});

		it('should define the smallmachine constants', function() {
			expect(smallmachine.CONCEPT).toBe('concept');
			expect(smallmachine.RELATIONSHIP).toBe('relationship');
		});

		it('should copy non-private properties when one object behaves like another', function() {
			var a = new A();
			var b = new B();
			smallmachine.alsoBehavesLike(a,b);
			expect(a.value).toBe(true);
		});

		it('should not copy private properties when one object behaves like another', function() {
			var a = new A();
			var b = new B();
			smallmachine.alsoBehavesLike(a,b);
			expect(a._value).not.toBeDefined();
		});

		it('should copy non-private methods when one class behaves like another', function() {
			var a = new A();
			var b = new B();
			expect(typeof a.test).toBe('function');
		});

		it('should override virtual methods when one class behaves like another', function() {
			var a = new A();
			var b = new B();
			var c = new C();
			expect(a.test()).toBe(false); // A behaves like B
			expect(b.test()).toBe(true); // B behaves like C
		});

		it('should add terms to an ontology at the child level', function() {
			var target = new smallmachine.Ontology();
			target.addTerm('test');
			expect(target.test).toBeDefined();
		});

		it('should add instances of Proxy to an ontology at the child level', function() {
			var target = new smallmachine.Ontology();
			target.addTerm('test');
			expect(target.test.getType() === '[object Proxy]').toBe(true);
		});

		it('should return a model with all of the terms from the ontology applied', function() {
			var target = new smallmachine.Ontology();
			target.addTerm('test');
			target.addTerm('again');
			var actual = target.getModel();
			expect(actual.test.getType() === '[object Term]').toBe(true);
			expect(actual.again.getType() === '[object Term]').toBe(true);
		});

		it('should save rules added to an ontology in the inferencer\'s _rules property', function() {
			var target = new smallmachine.Ontology();
			target.addTerm('test');
			target.addTerm('again');
			target.addTerm('andAgain');
			target.again.isA(target.test);
			target.andAgain.isA(target.test);
			expect(target._inferencer._rules.length).toBe(2);
		});

		it('should not include the inferencer in a model', function() {
			var target = new smallmachine.Ontology();
			var actual = target.getModel();
			expect(actual._inferencer).not.toBeDefined();
		});

		it('should include the title in a model', function() {
			var target = new smallmachine.Ontology('test');
			var actual = target.getModel();
			expect(actual.title).toBe('test');
		});

		it('should make a subclass of a Term a property of that Term', function() {
			var target = new smallmachine.Ontology('test');
			target.addTerm('number');
			target.addTerm('one');
			target.one.isA(target.number);
			var actual = target.getModel();
			expect(actual.number.one).toBeDefined();
		});

		it('should include a concept that is in the range of a relationship as a property of that relationship', function() {
			var target = new smallmachine.Ontology('test');
			target.addTerm('number');
			target.addTerm('one');
			target.addTerm('two');
			target.addTerm('precedes');
			target.one.isA(target.number);
			target.two.isA(target.number);
			target.precedes.hasRange(target.two);
			var actual = target.getModel();
			expect(actual.precedes.two).toBeDefined();
		});

		it('should include a relationship that is in the domain of a concept as a property of that concept', function() {
			var target = new smallmachine.Ontology('test');
			target.addTerm('number');
			target.addTerm('one');
			target.addTerm('two');
			target.addTerm('precedes');
			target.one.isA(target.number);
			target.two.isA(target.number);
			target.precedes.hasDomain(target.one);
			var actual = target.getModel();
			expect(actual.one.precedes).toBeDefined();
		});

	});
});

