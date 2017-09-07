/*
 * js核心知识：new 和我原型继承的深究
 */

/*--- js 中 的new 实际上是新建一个空对象 ---*/


function Book (){
	this.age = 12;
}
Book.prototype.name = "keke";

//正常调用
var book1 = new Book();
console.log(book1)

//上面的new相当于运行以下代码
var book2 = {};
book2.__proto__ = Book.prototype;
Book.call(book2);
console.log(book2)


/*-----------js原型继承--------------*/
var obj = {
	"name":"keke"
}
obj.__proto__ = {"age":12}
//此时变量obj将对象的引用传给了obj1
var obj1 = obj;
console.log(obj === obj1)//true

/*
 *  对于ES5中添加了 Object.create()，
	if(typeof Object.create !== "function"){
	    Object.create = function(o){
	        function F(){};
	        F.prototype = o;
	        return new F();
	    }
	}
 */
var obj2 =  Object.create(obj)
console.log(obj === obj2)//false

//模拟一遍Object.create()
function Obj(){};
Obj.prototype = obj;
var obj3 = new Obj();
console.log(obj === obj3) //false


/*
 * 将四个对象依次打印,可以看打，obj和obj1的引用指向了一个对象，中name是这个对象的ownproperty,
 * 但在obj2和obj3中没有name属性，但是他们的原型指向obj，而obj又将引用指向了一个对象，这个对象中有name属性
 */
console.log(obj)//{ name: 'keke' }
console.log(obj1)//{ name: 'keke' }
console.log(obj2)//{}
console.log(obj3)//{}
console.log(obj.name)//denghuan
console.log(obj1.name)//denghuan
console.log(obj2.name)//denghuan
console.log(obj3.name)//denghuan
console.log("age:"+obj.age)//12
console.log("age1:"+obj1.age)//12
console.log("age2:"+obj2.age)//12
console.log("age3:"+obj3.age)//12
/*
 * 修改obj的属性,obj1和obj的引用共同指向同一个对象，所以obj1.name === "denghuan";
 * obj2和obj3的原型是obj和obj1的引用对象，通过原型链继承了这个对象的name属性;
 */
obj.name = "denghuan";
obj.age = 25;
console.log(obj.name)//denghuan
console.log(obj1.name)//denghuan
console.log(obj2.name)//denghuan
console.log(obj3.name)//denghuan
console.log("age:"+obj.age)//25
console.log("age1:"+obj1.age)//25
console.log("age2:"+obj2.age)//25
console.log("age3:"+obj3.age)//25
/*
 * 现在修改obj的引用,可以发现，变量obj的引用发送了变化，而obj1的引用没变，obj2和obj3的原型链的引用也没变
 */
obj = {"age":23,"name":"song"};
console.log(obj.name)//song
console.log(obj1.name)//denghuan
console.log(obj2.name)//denghuan
console.log(obj3.name)//denghuan
console.log("age:"+obj.age)//23
console.log("age1:"+obj1.age)//25
console.log("age2:"+obj2.age)//25
console.log("age3:"+obj3.age)//25
/*
 * 修改obj2.name
 * 当对象自身有属性时，调用自己的属性，否则就沿着原型链寻找属性
 */
obj2.name = "obj2";
console.log(obj.name)//song
console.log(obj1.name)//denghuan
console.log(obj2.name)//obj2
console.log(obj3.name)//denghuan

/*
 * 从上面可以看出普通的复制对象的方法，直接赋值或者通过Object.create(),都不好，因为他们一个是直接传递引用，一个是
 * 通过原型继承，克隆后的对象无法拥有独立性，当原对象的属性发送变化时，克隆后的对象的属性也发送变化,这样不好，有一种方法
 * 可以解决这种问题 ,如下这种方法得到的obj5在内存中新建了一个对象，而不是引用obj的对象
 */

var obj5 = JSON.parse(JSON.stringify(obj));
console.log(obj === obj5)//false
console.log(obj);//{ age: 23, name: 'song' }
console.log(obj5)//{ age: 23, name: 'song' }
obj.name = "hahaha";
console.log(obj);//{ age: 23, name: 'hahaha' }
console.log(obj5)//{ age: 23, name: 'song' }


/*
 * 类的继承
 */
function Teacher(){
	this.name = "keke";
};

/*
 * Teacher.prototype其实就是在内存中建立一个新的对象，然后让函数通过__proto__继承该对象；
 * 如下两种方式等价
 */
//Teacher.prototype.age = 1;
Teacher.__proto__ = {
	age:1
};
/*----------------*/

function Student(){
	this.sex = "male"
}
/*
 * 根据上面克制prototy其实是将引用指向内存中的一个新的对象，所以Student.prototype和Teacher.prototype
 * 共同指向同一个对象，其中一个修改，另外一个也会发生修改
 */
Student.prototype = Teacher.prototype;

Student.prototype.age = 3;
var zs = new Student();
console.log(zs)
var tc = new Teacher();
console.log(tc)

/**
 * 想让Student类继承Teacher类的最好的方法
 */
Student.prototype = Object.create(Teacher.prototype);
Student.prototype.constructor = Student;

var stu = new Student();

console.log(stu)

