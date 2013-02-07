//test( "a basic test example", function() {
      //var value = "hello";
      //equal( value, "hello", "We expect value to be hello" );
    //});

define(
	[
	"js/models/Board"
	], function (Board) {
		return {
			RunTests: function () {
				test("ex-test", function () {
					var value = "hello";
					equal( value, "hello", "We expect value to be hello" );
				});
			}
		};
	}
);