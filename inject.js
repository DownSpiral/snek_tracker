
/**
 * injectScript - Inject internal script to available access to the `window`
 *
 * @param  {type} file_path Local path of the internal script.
 * @param  {type} tag The tag as string, where the script will be append (default: 'body').
 * @see    {@link http://stackoverflow.com/questions/20499994/access-window-variable-from-content-script}
 */
function injectScript(file_path, tag) {
    var node = document.getElementsByTagName(tag)[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', file_path);
    node.appendChild(script);
}
chrome.storage.local.get("server_address", function(address) {
  var body = document.getElementsByTagName('body')[0];
  var input = document.createElement('input');
  input.setAttribute('style', 'display: none;');
  input.setAttribute('id', 'server_address');
  input.value = address.server_address;
  body.appendChild(input);
  injectScript(chrome.extension.getURL('socket.io.min.js'), 'body');
  injectScript(chrome.extension.getURL('content.js'), 'body');
});
