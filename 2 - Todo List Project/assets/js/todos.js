
// Check off specific todos on click
$("ul").on("click", "li", function(){ // so new LIs have listeners
	$(this).toggleClass("completed");
});


// click to delete todo
$("ul").on("click", "span", function(event){
	event.stopPropagation();

	$(this).parent().fadeOut(500, function(){
		$(this).remove();
	});
});


// listener for new todos
$("input[type='text']").on("keypress", function(event){
	if(event.which == 13){
		createToDo($(this).val());
		$(this).val("");
	}
});


// create new todos
function createToDo(name){
	var li = "<li><span><i class=\"fa fa-trash\"></i></span> " + name + "</li>";

	$("ul").append(li);
}
