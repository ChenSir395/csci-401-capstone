let Embed = Quill.import('blots/embed');
var quill = new Quill("#editor");

var questionID = 0;
// array of tags
const tags = [];

class SpanEmbed extends Embed {
  static create(value) {
    const node = super.create();
    node.classList.add('span-insert');
    node.innerText = value;
    return node;
  }
}

window.onload = function () {
  // Quill initialization
  SpanEmbed.blotName = 'spanEmbed';
  SpanEmbed.tagName = 'span';
  Quill.register(SpanEmbed);
};

// Show options if checkbox or multiple choice is selected
document.querySelector("form").addEventListener("change", (event) => {
  // console.log(event.target);

  if (event.target.classList.contains("form-select")) {
    var select = event.target;
    var value = select.options[select.selectedIndex].value;
    if (value == "Multiple Choice" || value == "Checkboxes") {
      var selectedCard = event.target.closest(".card");
      selectedCard.querySelector(".options").classList.remove("d-none");
    }
    else {
      var selectedCard = event.target.closest(".card");
      selectedCard.querySelector(".options").classList.add("d-none");
    }
  }
});

// Handles click events inside form element
document.querySelector("form").addEventListener("click", (event) => {

  // Add option to question
  if (event.target.classList.contains("add-options-btn")) {
    addOption(event);
  }

  // Delete option from question
  var targetElem = event.target.closest(".col-radio-delete");
  if (targetElem) {
    deleteOption(targetElem);
  }

  // Delete question from form
  if (event.target.classList.contains("delete-question-icon")) {
    console.log(event.target);

    // Deleting corresponding tag if any
    if (tags.includes(event.target.id)) {
      var index = tags.indexOf(event.target.id);
      tags.splice(index, 1);

      document.querySelector("#t" + event.target.id).remove();
    }

    event.target.closest(".card").remove();
  }
});

// Handles input events inside form
document.querySelector("form").addEventListener("input", (event) => {
  // console.log(event);
  // Form validation
  if (event.target.value.length == 0) {
    event.target.classList.add("is-invalid");
  }
  else {
    event.target.classList.remove("is-invalid");
  }
});

// Adds option element
function addOption(event) {
  // Check if there is only one option, if so, show delete button
  var targetOptions = event.target.closest(".options");
  var optionsCount = targetOptions.childElementCount - 1;
  if (optionsCount == 1) {
    targetOptions.querySelector(".col-radio-delete").classList.remove("d-none");
  }

  // Find options div of current card
  var selectedOptions = event.target.closest(".options");

  var newOption = document.createDocumentFragment();

  var row = document.createElement("div");
  row.classList.add("row");

  var col1 = document.createElement("div");
  col1.classList.add("col-radio-input");

  var col2 = document.createElement("div");
  col2.classList.add("col-radio-delete");

  var input = document.createElement("input");
  input.type = "text";
  input.classList.add("form-control", "option-input");
  input.placeholder = "Option";

  var icon = document.createElement("i");
  icon.classList.add("fas", "fa-times");

  col1.appendChild(input);
  col2.appendChild(icon);
  row.appendChild(col1);
  row.appendChild(col2);
  newOption.appendChild(row);

  // Inserts new option before add option button
  var buttonRow = event.target.closest(".row");
  selectedOptions.insertBefore(newOption, buttonRow);
}

// Delete option
function deleteOption(targetElem) {
  // Check if there is at least on option left, subtract one for options button
  var targetOptions = targetElem.closest(".options");
  var optionsCount = targetOptions.childElementCount - 1;
  if (optionsCount > 1) {
    targetElem.closest(".row").remove();
    if (optionsCount == 2) {
      targetOptions.querySelector(".col-radio-delete").classList.add("d-none");
    }
  }
}

// Add question
document.querySelector(".add-questions-btn").addEventListener("click", (event) => {
  var form = document.querySelector("form");

  var newQuestion = document.createDocumentFragment();

  // Create question and dropdown
  var card = document.createElement("div");
  card.classList.add("card", "container", "align-middle");

  var question = document.createElement("div");
  question.classList.add("row");

  var col1 = document.createElement("div");
  col1.classList.add("col-8");

  var ques_input = document.createElement("input");
  ques_input.type = "text";
  ques_input.classList.add("form-control", "question-input");
  ques_input.placeholder = "Question";

  var col2 = document.createElement("div");
  col2.classList.add("col-4");

  var select = document.createElement("select");
  select.classList.add("form-select");

  var option1 = document.createElement("option");
  option1.value = "Text";
  option1.innerHTML = "Text";
  var option2 = document.createElement("option");
  option2.value = "Multiple Choice";
  option2.innerHTML = "Multiple Choice";
  var option3 = document.createElement("option");
  option3.value = "Checkboxes";
  option3.innerHTML = "Checkboxes";

  select.appendChild(option1);
  select.appendChild(option2);
  select.appendChild(option3);

  col2.appendChild(select);
  col1.appendChild(ques_input);

  question.appendChild(col1);
  question.appendChild(col2);

  // Create options section

  var options = document.createElement("div");
  options.classList.add("options", "d-none");

  var row1 = document.createElement("row");
  row1.classList.add("row");

  var col_input = document.createElement("div");
  col_input.classList.add("col-radio-input");

  var opt_input = document.createElement("input");
  opt_input.type = "text";
  opt_input.classList.add("form-control", "option-input");
  opt_input.placeholder = "Option";

  var col_delete = document.createElement("div");
  col_delete.classList.add("col-radio-delete", "d-none");

  var del_option_icon = document.createElement("i");
  del_option_icon.classList.add("fas", "fa-times");

  var row2 = document.createElement("row");
  row2.classList.add("row");

  var col_input2 = document.createElement("div");
  col_input2.classList.add("col-radio-input");

  var add_opt_button = document.createElement("button");
  add_opt_button.type = "button";
  add_opt_button.classList.add("add-btn", "add-options-btn");
  add_opt_button.innerHTML = "Add Option";

  col_delete.appendChild(del_option_icon);
  col_input.appendChild(opt_input);

  row1.appendChild(col_input);
  row1.appendChild(col_delete);

  col_input2.appendChild(add_opt_button);
  row2.appendChild(col_input2);

  options.appendChild(row1);
  options.appendChild(row2);

  // Creates tag section and question delete icon

  var tag = document.createElement("div");
  tag.classList.add("row");

  var col3 = document.createElement("div");
  col3.classList.add("col-4");

  var tag_input = document.createElement("input");
  tag_input.type = "text";
  tag_input.classList.add("form-control");
  tag_input.classList.add("tag-input");
  tag_input.placeholder = "Tag";

  // Adding Unique ID to dynamically created question
  tag_input.id = questionID;

  var col4 = document.createElement("div");
  col4.classList.add("col", "align-self-end");

  var icon = document.createElement("i");
  icon.classList.add("fas", "fa-trash", "float-end", "delete-question-icon");
  // Adding Unique ID to dynamically created question's delete button
  icon.id = questionID;
  questionID++;

  col4.appendChild(icon);
  col3.appendChild(tag_input);

  tag.appendChild(col3);
  tag.appendChild(col4);

  card.appendChild(question);
  card.appendChild(options);
  card.appendChild(tag);

  form.appendChild(card);
});

// Tag generation from Question

document.querySelector("form").addEventListener("input", function (event) {
  event.preventDefault();

  if (event.target && event.target.classList[1] == "tag-input") {
    var tag;
    if (!tags.includes(event.target.id)) {
      // console.log(event.target);
      var tag_container = document.querySelector(".tags");

      tag = document.createElement("div");
      tag.classList.add("col-sm-auto");
      tag.classList.add("tag");
      tag.id = "t" + event.target.id;
      tag.innerHTML = event.target.value;
      tag.setAttribute("data-value", event.target.value);

      tags.push(event.target.id);

      tag_container.appendChild(tag);
    }
    else {
      console.log("test");
      tag = document.querySelector("#t" + event.target.id);
      tag.innerHTML = event.target.value;
      tag.setAttribute("data-value", event.target.value);
      console.log(tags.length);
    }

    // Tag validation
    for (var i = 0; i < tags.length; i++) {
      var temp = document.querySelector("#t" + tags[i]);
      temp.classList.remove("d-none");
    }


    if (tag.innerHTML == "") {
      tag.classList.add("d-none");
    }
    
    for (var j=0; j<tags.length; j++) {
      var cur_tag = document.querySelector("#t" + tags[j]);
      for (var i = 0; i < tags.length; i++) {
        if (!(cur_tag.id === "t" + tags[i])) {
          var other_tag = document.querySelector("#t" + tags[i]);
          if (other_tag.innerHTML === cur_tag.innerHTML) {
            cur_tag.classList.add("d-none");
            other_tag.classList.add("d-none");
          }
        }
      }
    }
  }
});


// Tag insert
document.querySelector(".tags").addEventListener("click", (event) => {
  event.preventDefault();
  if (event.target.classList.contains("tag")) {
    console.log("click tag");

    quill.focus();
    var range = quill.getSelection();
    while (!range) { };
    if (range) {
      console.log(range.index);
      quill.insertEmbed(range.index, 'spanEmbed', " " + event.target.getAttribute('data-value') + " ")
      quill.setSelection(range.index + 1);
    }
  }
});

// Save template
document.querySelector(".save-btn").addEventListener("click", (event) => {

  // Form validation
  var hasError = 0;
  // Check template name
  var template_name = document.querySelector("#template-name");
  if (template_name.value.length == 0) {
    hasError = 1;
    template_name.classList.add("is-invalid");
  }

  // Check questions
  var questions = document.querySelectorAll(".question-input");
  for (var i = 0; i < questions.length; i++) {
    console.log(questions[i].value);
    if (questions[i].value.length == 0) {
      hasError = 1;
      questions[i].classList.add("is-invalid");
    }
  }

  // Check options
  var options = document.querySelectorAll(".option-input");
  console.log(options);
  for (var i = 0; i < options.length; i++) {
    console.log(options[i].value);
    if (options[i].value.length == 0) {
      console.log(options[i].closest(".options"));
      if (!options[i].closest(".options").classList.contains("d-none")) {
        hasError = 1;
        options[i].classList.add("is-invalid");
      }
    }
  }

  if (hasError) {
    alert("There are missing or invalid fields");
    return;
  }
});


// Add eventListener to info icons
document.getElementById("default-questions-info").onclick = function (event) {

  document.getElementById("exampleModalLabel").innerHTML = "Default Questions"
  document.getElementById("instructions").innerHTML = "Default questions are automatically added to the form and default tags are automatically created for the questions."
  document.getElementById("open-modal").click();
}

document.getElementById("additional-questions-info").onclick = function (event) {

  document.getElementById("exampleModalLabel").innerHTML = "Additional Questions"
  document.getElementById("instructions").innerHTML = "Add additional custom questions to the form."
  document.getElementById("open-modal").click();
}