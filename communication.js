
/*=============================================
=            Communication                   =
=============================================*/
/*
 * Functionality for communication between tab content and pop-up
 */
function tellTabToLoadCheeses(num_cheese) {
  deployFunction(loadCheeses, [num_cheese])
}

// deploy function on active tab
function deployFunction(func, args=[]) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: func,
      args: args
    });
  });
}
