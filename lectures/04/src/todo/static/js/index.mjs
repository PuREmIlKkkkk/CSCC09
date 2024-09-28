import { getItems, addItem, deleteItem } from "./api.mjs";

let page=0;

function onError(err) {
  console.error("[error]", err);
  const error_box = document.querySelector("#error_box");
  error_box.innerHTML = err.message;
  error_box.style.visibility = "visible";
}

function update() {
  getItems(page, onError, function (items) {
    document.querySelector("#items").innerHTML = "";
	document.querySelector("#prev").style.visibility = (page==0)?  "hidden" : "visible";
	document.querySelector("#next").style.visibility = (items.length < 5)?  "hidden" : "visible";
    items.forEach(function (item) {
      const element = document.createElement("div");
      element.className = "item";
      element.innerHTML = `
                <div class="item_content">${item.content}</div>
                <div class="delete-icon icon"></div>
            `;
      element
        .querySelector(".delete-icon")
        .addEventListener("click", function (e) {
          deleteItem(item._id, onError, update);
        });
      document.querySelector("#items").prepend(element);
    });
  });
}

document.querySelector("#prev").addEventListener("click", function (e) {
	e.preventDefault();
	page=Math.max(0, page-1);
	update();
});

document.querySelector("#next").addEventListener("click", function (e) {
	e.preventDefault();
	page=page+1;
	update();
});

document.querySelector("#add_item").addEventListener("submit", function (e) {
  e.preventDefault();
  let content = document.querySelector("#content_form").value;
  document.querySelector("#add_item").reset();
  addItem(content, onError, function(){
	  page=0;
	  update();
  });
});

(function refresh() {
  update();
  setTimeout(refresh, 5000);
})();
