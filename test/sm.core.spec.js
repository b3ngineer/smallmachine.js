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
			smallmachine.type.extendedBy(function() { return this; }, 'Test1');
			expect(smallmachine.type.Test1).toBeDefined();
			delete smallmachine.type.Test1;
		});

		it('should copy prototype functions when adding a message type', function() {
			var Test2 = function() {
				return this;
			};
			Test2.prototype.test = function() {
				return true;
			};
			smallmachine.type.extendedBy(Test2, 'Test2');
			expect(typeof smallmachine.type.Test2.prototype.test).toBe('function');
			delete smallmachine.type.Test2;
		});

		it('should create member functions on message type instances', function() {
			var Test3 = function() {
				return this;
			};
			Test3.prototype.test = function() {
				return true;
			};
			smallmachine.type.extendedBy(Test3, 'Test3');
			var testType = new smallmachine.type.Test3();
			expect(testType.test()).toBe(true);
			delete smallmachine.type.Test3;
		});

		it('should allow the use of instanceof to test an instance\'s type', function() {
			var Test4 = function() {
				return this;
			};
			smallmachine.type.extendedBy(Test4, 'Test4');
			var testType = new smallmachine.type.Test4();
			expect(testType instanceof smallmachine.type.Test4).toBe(true);
			delete smallmachine.type.Test4;
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

			smallmachine.type.extendedBy(TestA, 'Test');
			smallmachine.type.extendedBy(TestB, 'Test');
			expect(smallmachine.type.Test.prototype.methodA).toBeDefined();
			expect(smallmachine.type.Test.prototype.methodB).toBeDefined();
			delete smallmachine.type.Test;
		});

		it('should allow truthful comparison of types after merge', function() {
			var TestA = function() {
				this.propertyA = true;
				return this;
			};

			var TestB = function() {
				return this;
			};

			smallmachine.type.extendedBy(TestA, 'Test');
			smallmachine.type.extendedBy(TestB, 'Test');
			var test = new smallmachine.type.Test();
			expect(test.ofType('Test')).toBe(true);
			expect(test.getType()).toBe('[object Test]');
			expect(test instanceof smallmachine.type.Test).toBe(true);
			delete smallmachine.type.Test;
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

		it('should add the ontology property to the core', function() {
			expect(smallmachine.ontology).toBeDefined();
		});

		it('should mixin the TypeExtender prototype with the ontology property in the core', function() {
			expect(smallmachine.ontology.extendedBy).toBeDefined();
		});

		it('should merge all of the proxies when merging ontologies', function() {
			var ontologyA = new smallmachine.Ontology('testA');
			ontologyA.addTerm('one');
			var ontologyB = new smallmachine.Ontology('testB');
			ontologyB.addTerm('two');
			var actual = smallmachine([ontologyA, ontologyB]);
			expect(actual.one).toBeDefined();
			expect(actual.two).toBeDefined();
		});

		it('should merge all of the rules when merging ontologies', function() {
			var A = new smallmachine.Ontology('testA');
			A.addTerm('number');
			A.addTerm('one');
			A.one.isA(A.number);
			var B = new smallmachine.Ontology('testB');
			B.addTerm('number');
			B.addTerm('two');
			B.two.isA(B.number);
			var actual = smallmachine([A, B]);
			expect(actual.number.one).toBeDefined();
			expect(actual.number.two).toBeDefined();
		});
		
		it('should declared NamedValue type', function() {
			expect(smallmachine.type.NamedValue).toBeDefined();
		});

		it('NamedValue type should have namespace set', function() {
			var actual = new smallmachine.type.NamedValue('test', '123', true);
			expect(actual.namespace).toBe('test');
		});

		it('NamedValue type should have key set', function() {
			var actual = new smallmachine.type.NamedValue('test', '123', true);
			expect(actual.key).toBe('123');
		});

		it('NamedValueCollection should allow entries to be created from strings', function() {
			var actual = new smallmachine.type.NamedValueCollection();
			actual.add('a.b.c', 'd', true);
			expect(actual._collection['a.b.c']).toBeDefined();
			expect(actual._collection['a.b.c'].d).toBeDefined();
			expect(actual._collection['a.b.c'].d).toBe(true);
		});

		it('NamedValueCollection should allow entries to be created from NamedValue types', function() {
			var actual = new smallmachine.type.NamedValueCollection();
			actual.add(new smallmachine.type.NamedValue('a.b.c', 'd', true));
			expect(actual._collection['a.b.c']).toBeDefined();
			expect(actual._collection['a.b.c'].d).toBeDefined();
			expect(actual._collection['a.b.c'].d).toBe(true);
		});

		it('NamedValueCollection should allow entries to be removed', function() {
			var actual = new smallmachine.type.NamedValueCollection();
			actual.add(new smallmachine.type.NamedValue('a.b.c', 'd', true));
			expect(actual._collection['a.b.c'].d).toBeDefined();
			actual.remove('a.b.c', 'd');
			expect(actual._collection['a.b.c'].d).not.toBeDefined();
		});

		it('should return true when typeMasking an object with the expected member and member type of function', function() {
			var actual = { test : function() { } };
			var target  = { test : 'function' } ;
			expect(smallmachine.typeMask(actual, target)).toBe(null);
		});

		it('should return true when typeMasking an object with the expected member and only being defined as a requirement', function() {
			var actual = { test : 1 };
			var target  = { test : true } ;
			expect(smallmachine.typeMask(actual, target)).toBe(null);
		});

		it('should return an array when typeMasking an object without the expected member', function() {
			var a = { testA : function() { } };
			var b  = { testB : 'function' } ;
			var actual = smallmachine.typeMask(a, b);
			expect(actual.length).toBe(1);
		});

		it('should return an array when typeMasking an object with the expected member but without the expected member type', function() {
			var a = { testA : function() { } };
			var b  = { testB : 'object' } ;
			var actual = smallmachine.typeMask(a, b);
			expect(actual.length).toBe(1);
		});

		it('should return all of the properties identified in the mask when comparing against something undefined', function() {
			var junk;
			var b  = { testB : 'object' } ;
			var actual = smallmachine.typeMask(junk, b);
			expect(actual.length).toBe(1);
		});
	});
});

