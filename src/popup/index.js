var document = require('global/document');

// when an element is changed save it to chome storage
document.addEventListener('DOMContentLoaded', function() {
  var container = document.getElementById('container');
  var button = document.createElement('button');
  var list = document.createElement('ul');
  var label = document.createElement('h3');

  container.appendChild(label)
  container.appendChild(list)
  container.appendChild(button)

  button.id = 'options';
  button.innerHTML = 'options';
  label.innerText = 'Recent Videos';

  button.addEventListener('click', function(e) {
    chrome.runtime.openOptionsPage()
  });
  chrome.storage.sync.get('recentVideos', function(o) {
    if (!o.recentVideos) {
      var item = document.createElement('li');
      item.innerText = 'No recent videos'
      list.appendChild(item);
      return;
    }

    o.recentVideos.forEach(function(v) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      list.appendChild(li);
      li.appendChild(a);
      a.href = v;
      a.innerText = v;
      a.addEventListener('click', function(e) {
        e.preventDefault();
        chrome.tabs.create({url: v});
        return false;
      });
    });
  })
});


