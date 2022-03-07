(function () { function r(e, n, t) { function o(i, f) { if (!n[i]) { if (!e[i]) { var c = "function" == typeof require && require; if (!f && c) return c(i, !0); if (u) return u(i, !0); var a = new Error("Cannot find module '" + i + "'"); throw a.code = "MODULE_NOT_FOUND", a } var p = n[i] = { exports: {} }; e[i][0].call(p.exports, function (r) { var n = e[i][1][r]; return o(n || r) }, p, p.exports, r, e, n, t) } return n[i].exports } for (var u = "function" == typeof require && require, i = 0; i < t.length; i++)o(t[i]); return o } return r })()({
    1: [function (require, module, exports) {
        (function (global) {
            (function () {
                "use strict";

                var _queryString = require("query-string");

                var _queryString2 = _interopRequireDefault(_queryString);

                var _uuid = require("uuid");

                function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

                // import WebSocket from 'ws';

                var CONFIG = {
                    userid_or_mobile: "urn:finvu:in:app:req.userIdOrMobileNo.01",
                    login_encrypt: "urn:finvu:in:app:req.webViewloginOtp.01",
                    user_info: "urn:finvu:in:app:req.userInfo.01",
                    consent_request_detail_encrypt: "urn:finvu:in:app:req.webViewConsentDetail.01",
                    login: "urn:finvu:in:app:req.loginOtp.01",
                    verfiyotp: "urn:finvu:in:app:req.loginOtpVerify.01",
                    mobile_verfiy: "urn:finvu:in:app:req.mobileVerification.01",
                    verfiy_mobile_otp: "urn:finvu:in:app:req.mobileVerificationVerify.01",
                    user_link: "urn:finvu:in:app:req.userLinkedAccount.01",
                    account_discovery: "urn:finvu:in:app:req.discover.01",
                    account_link: "urn:finvu:in:app:req.linking.01",
                    account_link_confim: "urn:finvu:in:app:req.confirm-token.01",
                    consent_request: "urn:finvu:in:app:req.consentRequestDetails.01",
                    consent_request_approve: "urn:finvu:in:app:req.accountConsentRequest.01",
                    popular_fip_list: "urn:finvu:in:app:req.popularSearch.01",
                    entity_info: "urn:finvu:in:app:req.entityInfo.01",
                    logout: "urn:finvu:in:app:req.logout.01"
                };

                var websocketUrl = "wss://" + new URL(document.currentScript.src).hostname + "/webapi";
                var VERSION = "1.1.2";
                var logEnable = true;

                var log = function log(msg) {
                    if (logEnable) {
                        console.log(msg);
                    }
                };

                var costomer_validation = /^[a-zA-Z0-9][-_\\.a-zA-Z0-9]{5,29}@finvu$/;
                var mobileNum_validation = /^[0-9]{10}$/;
                var otp_validation = /^(\d{6},)*\d{6}$/;

                var finvuWebsocket = function () {
                    var client = "";
                    var otpReference = "";
                    var sid = "";
                    var handleID = "";
                    var userId = "";

                    var ecreq = "";
                    var reqDate = "";
                    var fi = "";

                    var user_details = {};
                    var user_info = {};

                    var setOTPReference = function setOTPReference(otpReference) {
                        otpReference = otpReference;
                    };

                    var setClient = function setClient(client) {
                        client = client;
                    };

                    var set_listener = function set_listener() {
                        client.addEventListener("open", function () {
                            log("Websocket Connected to " + websocketUrl);
                        });

                        client.addEventListener("close", function () {
                            log("Websocket Disconnected.");
                            client = null;
                        });
                    };

                    var getResponse = async function getResponse(requestID) {
                        return new Promise(function (resolve, reject) {
                            client.addEventListener('message', function (e) {
                                var obj = JSON.parse(e.data);
                                log("response");
                                log(obj);
                                if (obj && obj.payload && (obj.payload.status == "FAILURE" || obj.payload.status == "REJECT")) {
                                    var err_msg = "FAILURE: " + obj.payload.message;
                                    resolve(err_msg);
                                } else {
                                    log(JSON.stringify(obj, null, 2));
                                    if (requestID === obj.header.mid) {
                                        log("response..");
                                        resolve(obj);
                                    } else {
                                        resolve("Not found valid response");
                                    }
                                }
                            });
                            client.addEventListener("error", function (error) {
                                log(error);
                                resolve(error);
                            });
                        });
                    };

                    var waitForOpenConnection = function waitForOpenConnection(socket) {
                        return new Promise(function (resolve, reject) {
                            var maxNumberOfAttempts = 10;
                            var intervalTime = 1000; //ms

                            var currentAttempt = 0;
                            var interval = setInterval(function () {
                                if (currentAttempt > maxNumberOfAttempts - 1) {
                                    clearInterval(interval);
                                    reject(new Error('Maximum number of attempts exceeded'));
                                } else if (socket.readyState === socket.OPEN) {
                                    clearInterval(interval);
                                    resolve();
                                }
                                currentAttempt++;
                            }, intervalTime);
                        });
                    };

                    var sendMessage = async function sendMessage(msg) {
                        var midid = msg.header.mid;
                        log(JSON.stringify(msg, null, 4));
                        if (client.readyState !== client.OPEN) {
                            try {
                                await waitForOpenConnection(client);
                                log("sending...");
                                client.send(JSON.stringify(msg));
                            } catch (err) {
                                console.error(err);
                            }
                        } else {
                            log("sending...");
                            client.send(JSON.stringify(msg));
                        }
                        var res = await getResponse(midid);
                        return res;
                    };

                    var get_request_param = function get_request_param(payload, _type) {
                        var header = get_header(_type);
                        return {
                            header: header,
                            payload: payload
                        };
                    };

                    var getFullTimestamp = function getFullTimestamp() {
                        var _date = new Date().toISOString();
                        return _date;
                    };

                    //"2000-12-28T16:56:03-08:00"
                    var get_header = function get_header(method_name) {
                        return {
                            mid: (0, _uuid.v4)(),
                            ts: getFullTimestamp(),
                            sid: sid,
                            dup: false,
                            type: CONFIG[method_name]
                        };
                    };

                    var isEmptyObject = function isEmptyObject(obj) {
                        return !!obj && Object.keys(obj).length === 0 && obj.constructor === Object;
                    };

                    var _open = function _open() {
                        client = new WebSocket(websocketUrl);
                        setClient(client);
                        set_listener();
                    };
                    var sample = async function sample() {
                        return 100;
                    };

                    /* Web-redirection based integration methods START */
                    var redirectionValidation = function redirectionValidation(request, timestamp, fi) {
                        var status = true;
                        var msg = "";

                        if (!request) {
                            status = false;
                            msg = "ecreq not set.";
                        }

                        if (!timestamp) {
                            status = false;
                            msg = "reqdate not set.";
                        }

                        if (!fi) {
                            status = false;
                            msg = "fi not set.";
                        };

                        return {
                            status: status,
                            message: msg
                        };
                    };

                    var getEncRequest = function getEncRequest() {
                        return {
                            encryptedRequest: ecreq,
                            requestDate: reqDate,
                            encryptedFiuId: fi
                        };
                    };

                    var _fiuInfo = async function _fiuInfo(request, timestamp, inst) {
                        var msg = "";
                        var status = "FAILURE";
                        var _res = redirectionValidation(request, timestamp, inst);
                        if (_res.status) {
                            ecreq = request;
                            reqDate = timestamp;
                            fi = inst;
                            var payload = getEncRequest();
                            var _payload = get_request_param(payload, 'userid_or_mobile');
                            var res = await sendMessage(_payload);
                            if (res && res.payload) {
                                if (res.payload.status == "SUCCESS") {
                                    return res;
                                } else {
                                    status = res.payload.status;
                                    msg = res.payload.message;
                                }
                            } else {
                                return {
                                    status: 'FAILURE',
                                    message: res
                                };
                            }
                        } else {
                            status = 'FAILURE';
                            msg = _res.message;
                        }
                        return {
                            status: status,
                            message: msg
                        };
                    };

                    var _loginEncrypt = async function _loginEncrypt() {
                        var msg = "";
                        var status = "FAILURE";
                        if (ecreq) {
                            var payload = getEncRequest();
                            var _payload = get_request_param(payload, 'login_encrypt');
                            var res = await sendMessage(_payload);
                            if (res && res.payload) {
                                if (res.payload.status == "SEND") {
                                    otpReference = res.payload.otpReference;
                                }
                                status = res.payload.status;
                                msg = res.payload.message;
                            } else {
                                return {
                                    status: 'FAILURE',
                                    message: res
                                };
                            }
                        } else {
                            status = 'FAILURE';
                            msg = 'Request not set.';
                        }
                        return {
                            status: status,
                            message: msg
                        };
                    };

                    var _consentRequestDetailsEnc = async function _consentRequestDetailsEnc() {
                        var payload = getEncRequest();
                        var _payload = get_request_param(payload, 'consent_request_detail_encrypt');
                        var res = await sendMessage(_payload);
                        if (res && res.payload) {
                            user_details = res.payload;
                            handleID = res.payload.ConsentHandle;
                            return res.payload;
                        }
                        return res;
                    };

                    /* Web-redirection based integration methods END */

                    var loginValidation = function loginValidation(handleId, username, mobileNub) {
                        var status = true;
                        var msg = "";

                        if (!handleId) {
                            status = false;
                            msg = "handleId require for ";
                        }

                        if (mobileNub || username) {
                            status = true;
                        } else {
                            status = false;
                            msg = "username or mobile Required";
                        }

                        if (!costomer_validation.test(username)) {
                            if (username) {
                                status = false;
                                msg = "Invalid username ";
                            }
                        }

                        if (!mobileNum_validation.test(mobileNub)) {
                            if (mobileNub) {
                                status = false;
                                msg = "Invalid Mobile Number";
                            }
                        };

                        return {
                            status: status,
                            message: msg
                        };
                    };

                    var _login = async function _login(handleId, username, mobileNub) {
                        var msg = "";
                        var status = "SEND";
                        var _res = loginValidation(handleId, username, mobileNub);
                        if (_res.status) {
                            userId = username;
                            handleID = handleId;
                            var payload = {
                                handleId: handleId,
                                username: username,
                                mobileNum: mobileNub
                            };
                            var _payload = get_request_param(payload, 'login');
                            var res = await sendMessage(_payload);
                            if (res && res.payload && res.payload.otpReference) {
                                otpReference = res.payload.otpReference;
                                status = res.payload.status;
                                msg = res.payload.message;
                            } else {
                                return res;
                            }
                        } else {
                            status = 'FAILURE';
                            msg = _res.message;
                        }
                        return {
                            status: status,
                            message: msg
                        };
                    };

                    var OTPValidation = function OTPValidation(otp) {
                        var status = true;
                        var msg = "";

                        if (!otp_validation.test(otp)) {
                            status = false;
                            msg = "Invalid OTP format";
                        }

                        return {
                            status: status,
                            message: msg
                        };
                    };

                    var _verifyOTP = async function _verifyOTP(otp) {
                        var _res = OTPValidation(otp);
                        if (_res.status) {
                            var payload = {
                                otpReference: otpReference,
                                otp: otp
                            };
                            var _payload = get_request_param(payload, 'verfiyotp');
                            var res = await sendMessage(_payload);
                            if (res && res.header && res.header.sid) {
                                sid = res.header.sid;
                                userId = res.payload.userId;
                                if (ecreq) {
                                    await _consentRequestDetailsEnc();
                                } else {
                                    await _consentRequestDetails();
                                }

                                var userInfoRes = await _userInfo();
                                if (userInfoRes.status != "ACCEPT") {
                                    return {
                                        status: userInfoRes.status,
                                        message: userInfoRes.message
                                    };
                                }

                                return {
                                    status: res.payload.status,
                                    message: res.payload.message
                                };
                            } else {
                                return res;
                            }
                        } else {
                            return {
                                status: 'FAILURE',
                                message: _res.message
                            };
                        }
                    };

                    var _mobileVerificationRequest = async function _mobileVerificationRequest(mobileNum) {
                        var status = "SEND";
                        var msg = "";
                        if (mobileNum) {
                            var payload = {
                                mobileNum: mobileNum
                            };
                            if (!mobileNum_validation.test(mobileNum)) {
                                return {
                                    status: 'FAILURE',
                                    message: "Invalid mobile number"
                                };
                            }
                            try {
                                var _mobile_number = Number(userId.split("@")[0]);
                                if (_mobile_number == mobileNum) {
                                    return {
                                        status: 'FAILURE',
                                        message: "Already used mobile in userId"
                                    };
                                }
                            } catch (err) {
                                log(err);
                            }

                            if (isEmpty(sid)) {
                                return {
                                    status: 'FAILURE',
                                    message: "Login Required"
                                };
                            };

                            var _payload = get_request_param(payload, 'mobile_verfiy');
                            var res = await sendMessage(_payload);
                            if (res && res.payload && res.payload.status == "SEND") {
                                return {
                                    status: res.payload.status,
                                    message: res.payload.message
                                };
                            }
                            return res;
                        } else {

                            return {
                                status: 'FAILURE',
                                message: "Mobile number can't be blank"
                            };
                        }
                    };

                    var _mobileVerificationVerfiyRequest = async function _mobileVerificationVerfiyRequest(mobileNum, otp) {
                        if (mobileNum && otp) {
                            var payload = {
                                mobileNum: mobileNum,
                                otp: otp
                            };

                            if (!mobileNum_validation.test(mobileNum)) {
                                return {
                                    status: 'FAILURE',
                                    message: "Invalid mobile number"
                                };
                            }

                            if (!otp_validation.test(otp)) {
                                return {
                                    status: 'FAILURE',
                                    message: "Invalid OTP format"
                                };
                            }

                            if (isEmpty(sid)) {
                                return {
                                    status: 'FAILURE',
                                    message: "Login Required"
                                };
                            };

                            var _payload = get_request_param(payload, 'verfiy_mobile_otp');
                            var res = await sendMessage(_payload);
                            if (res && res.payload && res.payload.status == "ACCEPT") {
                                return {
                                    status: res.payload.status,
                                    message: res.payload.message
                                };
                            }
                            return res;
                        } else {
                            return {
                                status: 'FAILURE',
                                message: "Mobile number can't be blank"
                            };
                        }
                    };

                    var _userInfo = async function _userInfo() {

                        if (isEmpty(sid)) {
                            return {
                                status: 'FAILURE',
                                message: "Login Required"
                            };
                        };

                        var payload = {
                            userId: userId
                        };

                        var _payload = get_request_param(payload, 'user_info');
                        var res = await sendMessage(_payload);
                        if (res && res.payload) {
                            user_info = res.payload;
                            return res.payload;
                        }
                        return res;
                    };

                    var _userDetails = function _userDetails() {
                        return user_info;
                    };

                    var _userLinkedAccounts = async function _userLinkedAccounts() {
                        var payload = {
                            userId: userId
                        };

                        if (isEmpty(sid)) {
                            return {
                                status: 'FAILURE',
                                message: "Login Required"
                            };
                        };

                        var _payload = get_request_param(payload, 'user_link');
                        var res = await sendMessage(_payload);
                        if (res && res.payload) {
                            return res.payload;
                        }
                        return res;
                    };

                    var account_discovery_payload = function account_discovery_payload(fipId, identifiers) {
                        var account_discovery_payload = {
                            "ver": VERSION,
                            "timestamp": getFullTimestamp(),
                            "txnid": (0, _uuid.v4)(),
                            "Customer": {
                                "id": userId,
                                "Identifiers": identifiers
                            },
                            "FIPDetails": {
                                "fipId": fipId,
                                "fipName": "Finvu Bank"
                            },
                            "FITypes": user_details.fiTypes
                        };
                        return account_discovery_payload;
                    };
                    var validate_disovery = function validate_disovery(payload) {
                        // validation for verison
                        if (payload.ver == "1.1.2") { } else {

                            throw "FAILURE: Invalid verison";
                        }
                        // validation for customer id
                        if (payload.Customer && payload.Customer.id == userId) { } else {
                            throw "FAILURE: Invalid userId";
                        }
                        // validation for FITypes
                    };

                    var _discoverAccounts = async function _discoverAccounts(fipid, Identifiers) {
                        var _discoveredAccounts = [];
                        if (isEmpty(sid)) {
                            return {
                                status: 'FAILURE',
                                message: "Login Required"
                            };
                        };

                        if (isEmpty(fipid)) {
                            return {
                                status: 'FAILURE',
                                message: "FIPID Required"
                            };
                        };

                        var payload = account_discovery_payload(fipid, Identifiers);
                        validate_disovery(payload);
                        if (payload) {
                            var _payload = get_request_param(payload, 'account_discovery');
                            var res = await sendMessage(_payload);
                            if (res && res.payload) {
                                var _discoveredAccountsList = res.payload.DiscoveredAccounts || [];
                                _discoveredAccountsList.forEach(function (v) {
                                    if (user_details.fiTypes.includes(v.FIType)) {
                                        _discoveredAccounts.push(v);
                                    }
                                });
                                return {
                                    status: res.payload.status,
                                    message: res.payload.message,
                                    DiscoveredAccounts: _discoveredAccounts
                                };
                            }
                            return res;
                        } else {
                            return {
                                status: 'FAILURE',
                                message: "Mobile number can't be blank"
                            };
                        }
                    };

                    var account_linking_payload = function account_linking_payload(fid, accounts) {
                        var _payload = {
                            "ver": VERSION,
                            "timestamp": getFullTimestamp(),
                            "txnid": (0, _uuid.v4)(),
                            "FIPDetails": {
                                "fipId": fid,
                                "fipName": "Finvu Bank"
                            },
                            "Customer": {
                                "id": userId,
                                "Accounts": accounts
                            }
                        };
                        return _payload;
                    };

                    var account_linking_confirm_payload = function account_linking_confirm_payload(accountRefernceNumber, token) {
                        var _payload = {
                            "ver": VERSION,
                            "timestamp": getFullTimestamp(),
                            "txnid": (0, _uuid.v4)(),
                            "AccountsLinkingRefNumber": accountRefernceNumber,
                            "token": token
                        };
                        return _payload;
                    };
                    var _accountLinking = async function _accountLinking(fid, account) {
                        if (isEmpty(sid)) {
                            return {
                                status: 'FAILURE',
                                message: "Login Required"
                            };
                        };

                        var payload = account_linking_payload(fid, account);
                        validate_disovery(payload);

                        if (payload) {
                            var _payload = get_request_param(payload, 'account_link');
                            var res = await sendMessage(_payload);
                            if (res && res.payload) {
                                return res.payload;
                            }
                            return res;
                        } else {
                            return {
                                status: 'FAILURE',
                                message: "Invalid input format"
                            };
                        }
                    };
                    var _accountConfirmLinking = async function _accountConfirmLinking(accountRefernceNumber, token) {
                        if (isEmpty(sid)) {
                            return {
                                status: 'FAILURE',
                                message: "Login Required"
                            };
                        };

                        if (isEmpty(accountRefernceNumber)) {
                            return {
                                status: 'FAILURE',
                                message: "AccountRefernceNumber required"
                            };
                        }

                        if (isEmpty(token)) {
                            return {
                                status: 'FAILURE',
                                message: "Token Required"
                            };
                        }

                        var payload = account_linking_confirm_payload(accountRefernceNumber, token);
                        if (payload) {
                            var _payload = get_request_param(payload, 'account_link_confim');
                            var res = await sendMessage(_payload);
                            if (res && res.payload) {
                                return res.payload;
                            }
                            return res;
                        } else {
                            return {
                                status: 'FAILURE',
                                message: "Invalid input format"
                            };
                        }
                    };
                    var isEmpty = function isEmpty(value) {
                        return value == null || value.length === 0;
                    };

                    var isObject = function isObject(val) {
                        return val instanceof Object;
                    };

                    // remove params
                    var _consentRequestDetails = async function _consentRequestDetails() {
                        var payload = {
                            consentHandleId: handleID,
                            userId: userId
                        };
                        var _payload = get_request_param(payload, 'consent_request');
                        var res = await sendMessage(_payload);
                        if (res && res.payload) {
                            user_details = res.payload;
                            return res.payload;
                        }
                        return res;
                    };

                    var consent_request_approve_payload = function consent_request_approve_payload(FIPDetails, handleStatus) {
                        var _payload = {
                            "FIPDetails": FIPDetails,
                            "FIU": {
                                "id": user_details.FIU.id
                            },
                            "ver": VERSION,
                            "consentHandleId": handleID,
                            "handleStatus": handleStatus
                        };
                        return _payload;
                    };

                    var _consentApproveRequest = async function _consentApproveRequest(FIPDetails, handleStatus) {

                        if (isEmpty(sid)) {
                            return {
                                status: 'FAILURE',
                                message: "Login Required"
                            };
                        };

                        if (handleStatus == "ACCEPT" || handleStatus == "DENY") {
                            console.log(handleStatus);
                        } else {
                            return {
                                status: 'FAILURE',
                                message: "handleStatus status should ACCEPT or DENY"
                            };
                        }

                        var payload = consent_request_approve_payload(FIPDetails, handleStatus);
                        var _payload = get_request_param(payload, 'consent_request_approve');
                        var res = await sendMessage(_payload);
                        if (res && res.payload) {
                            return res.payload;
                        }
                        return res;
                    };

                    var _entityInfo = async function _entityInfo(entityId, entityType) {
                        if (isEmpty(entityId) || isEmpty(entityType)) {
                            return {
                                status: 'FAILURE',
                                message: "Entity id and/or Entity type missing"
                            };
                        }

                        if (entityType != 'FIU' || entityType != 'FIP') {
                            return {
                                status: 'FAILURE',
                                message: "Invalid Entity type. FIP or FIU expected."
                            };
                        }

                        var payload = {
                            "entityId": entityId,
                            "entityType": entityType
                        };

                        var _payload = get_request_param(payload, 'entity_info');
                        var res = await sendMessage(_payload);
                        if (res && res.payload) {
                            return res.payload;
                        }
                        return res;
                    };

                    var _popularFipList = async function _popularFipList() {
                        var payload = {};
                        var _payload = get_request_param(payload, 'popular_fip_list');
                        var res = await sendMessage(_payload);
                        if (res && res.payload) {
                            return res.payload;
                        }
                        return res;
                    };

                    var _logout = async function _logout(userId) {
                        if (userId) {
                            var payload = {
                                userId: userId
                            };
                            var _payload = get_request_param(payload, 'logout');
                            var res = await sendMessage(_payload);
                            client.close();
                            return {
                                status: 'SUCCESS',
                                message: "Successfully logout"
                            };
                        } else {
                            return {
                                status: 'FAILURE',
                                message: "Already logged out"
                            };
                        }
                    };

                    var public_interface = {
                        open: _open,
                        fiuInfo: _fiuInfo,
                        loginEncrypt: _loginEncrypt,
                        consentRequestDetailsEnc: _consentRequestDetailsEnc,
                        login: _login,
                        verifyOTP: _verifyOTP,
                        userDetails: _userDetails,
                        mobileVerificationRequest: _mobileVerificationRequest,
                        mobileVerificationVerfiyRequest: _mobileVerificationVerfiyRequest,
                        userLinkedAccounts: _userLinkedAccounts,
                        discoverAccounts: _discoverAccounts,
                        accountLinking: _accountLinking,
                        accountConfirmLinking: _accountConfirmLinking,
                        consentRequestDetails: _consentRequestDetails,
                        consentApproveRequest: _consentApproveRequest,
                        entityInfo: _entityInfo,
                        popularFipList: _popularFipList,
                        logout: _logout
                    };
                    var wrapper = function wrapper() {
                        try {
                            return public_interface;
                        } catch (error) {
                            console.error(error);
                            return "Unknown Error";
                        }
                    };

                    var myObj = new wrapper();
                    return myObj;
                }();
                global.window.finvuClient = finvuWebsocket;
            }).call(this)
        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, { "query-string": 4, "uuid": 7 }], 2: [function (require, module, exports) {
        'use strict';
        var token = '%[a-f0-9]{2}';
        var singleMatcher = new RegExp(token, 'gi');
        var multiMatcher = new RegExp('(' + token + ')+', 'gi');

        function decodeComponents(components, split) {
            try {
                // Try to decode the entire string first
                return decodeURIComponent(components.join(''));
            } catch (err) {
                // Do nothing
            }

            if (components.length === 1) {
                return components;
            }

            split = split || 1;

            // Split the array in 2 parts
            var left = components.slice(0, split);
            var right = components.slice(split);

            return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
        }

        function decode(input) {
            try {
                return decodeURIComponent(input);
            } catch (err) {
                var tokens = input.match(singleMatcher);

                for (var i = 1; i < tokens.length; i++) {
                    input = decodeComponents(tokens, i).join('');

                    tokens = input.match(singleMatcher);
                }

                return input;
            }
        }

        function customDecodeURIComponent(input) {
            // Keep track of all the replacements and prefill the map with the `BOM`
            var replaceMap = {
                '%FE%FF': '\uFFFD\uFFFD',
                '%FF%FE': '\uFFFD\uFFFD'
            };

            var match = multiMatcher.exec(input);
            while (match) {
                try {
                    // Decode as big chunks as possible
                    replaceMap[match[0]] = decodeURIComponent(match[0]);
                } catch (err) {
                    var result = decode(match[0]);

                    if (result !== match[0]) {
                        replaceMap[match[0]] = result;
                    }
                }

                match = multiMatcher.exec(input);
            }

            // Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else
            replaceMap['%C2'] = '\uFFFD';

            var entries = Object.keys(replaceMap);

            for (var i = 0; i < entries.length; i++) {
                // Replace all decoded components
                var key = entries[i];
                input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
            }

            return input;
        }

        module.exports = function (encodedURI) {
            if (typeof encodedURI !== 'string') {
                throw new TypeError('Expected `encodedURI` to be of type `string`, got `' + typeof encodedURI + '`');
            }

            try {
                encodedURI = encodedURI.replace(/\+/g, ' ');

                // Try the built in decoder first
                return decodeURIComponent(encodedURI);
            } catch (err) {
                // Fallback to a more advanced decoder
                return customDecodeURIComponent(encodedURI);
            }
        };

    }, {}], 3: [function (require, module, exports) {
        'use strict';
        module.exports = function (obj, predicate) {
            var ret = {};
            var keys = Object.keys(obj);
            var isArr = Array.isArray(predicate);

            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var val = obj[key];

                if (isArr ? predicate.indexOf(key) !== -1 : predicate(key, val, obj)) {
                    ret[key] = val;
                }
            }

            return ret;
        };

    }, {}], 4: [function (require, module, exports) {
        'use strict';
        const strictUriEncode = require('strict-uri-encode');
        const decodeComponent = require('decode-uri-component');
        const splitOnFirst = require('split-on-first');
        const filterObject = require('filter-obj');

        const isNullOrUndefined = value => value === null || value === undefined;

        const encodeFragmentIdentifier = Symbol('encodeFragmentIdentifier');

        function encoderForArrayFormat(options) {
            switch (options.arrayFormat) {
                case 'index':
                    return key => (result, value) => {
                        const index = result.length;

                        if (
                            value === undefined ||
                            (options.skipNull && value === null) ||
                            (options.skipEmptyString && value === '')
                        ) {
                            return result;
                        }

                        if (value === null) {
                            return [...result, [encode(key, options), '[', index, ']'].join('')];
                        }

                        return [
                            ...result,
                            [encode(key, options), '[', encode(index, options), ']=', encode(value, options)].join('')
                        ];
                    };

                case 'bracket':
                    return key => (result, value) => {
                        if (
                            value === undefined ||
                            (options.skipNull && value === null) ||
                            (options.skipEmptyString && value === '')
                        ) {
                            return result;
                        }

                        if (value === null) {
                            return [...result, [encode(key, options), '[]'].join('')];
                        }

                        return [...result, [encode(key, options), '[]=', encode(value, options)].join('')];
                    };

                case 'comma':
                case 'separator':
                case 'bracket-separator': {
                    const keyValueSep = options.arrayFormat === 'bracket-separator' ?
                        '[]=' :
                        '=';

                    return key => (result, value) => {
                        if (
                            value === undefined ||
                            (options.skipNull && value === null) ||
                            (options.skipEmptyString && value === '')
                        ) {
                            return result;
                        }

                        // Translate null to an empty string so that it doesn't serialize as 'null'
                        value = value === null ? '' : value;

                        if (result.length === 0) {
                            return [[encode(key, options), keyValueSep, encode(value, options)].join('')];
                        }

                        return [[result, encode(value, options)].join(options.arrayFormatSeparator)];
                    };
                }

                default:
                    return key => (result, value) => {
                        if (
                            value === undefined ||
                            (options.skipNull && value === null) ||
                            (options.skipEmptyString && value === '')
                        ) {
                            return result;
                        }

                        if (value === null) {
                            return [...result, encode(key, options)];
                        }

                        return [...result, [encode(key, options), '=', encode(value, options)].join('')];
                    };
            }
        }

        function parserForArrayFormat(options) {
            let result;

            switch (options.arrayFormat) {
                case 'index':
                    return (key, value, accumulator) => {
                        result = /\[(\d*)\]$/.exec(key);

                        key = key.replace(/\[\d*\]$/, '');

                        if (!result) {
                            accumulator[key] = value;
                            return;
                        }

                        if (accumulator[key] === undefined) {
                            accumulator[key] = {};
                        }

                        accumulator[key][result[1]] = value;
                    };

                case 'bracket':
                    return (key, value, accumulator) => {
                        result = /(\[\])$/.exec(key);
                        key = key.replace(/\[\]$/, '');

                        if (!result) {
                            accumulator[key] = value;
                            return;
                        }

                        if (accumulator[key] === undefined) {
                            accumulator[key] = [value];
                            return;
                        }

                        accumulator[key] = [].concat(accumulator[key], value);
                    };

                case 'comma':
                case 'separator':
                    return (key, value, accumulator) => {
                        const isArray = typeof value === 'string' && value.includes(options.arrayFormatSeparator);
                        const isEncodedArray = (typeof value === 'string' && !isArray && decode(value, options).includes(options.arrayFormatSeparator));
                        value = isEncodedArray ? decode(value, options) : value;
                        const newValue = isArray || isEncodedArray ? value.split(options.arrayFormatSeparator).map(item => decode(item, options)) : value === null ? value : decode(value, options);
                        accumulator[key] = newValue;
                    };

                case 'bracket-separator':
                    return (key, value, accumulator) => {
                        const isArray = /(\[\])$/.test(key);
                        key = key.replace(/\[\]$/, '');

                        if (!isArray) {
                            accumulator[key] = value ? decode(value, options) : value;
                            return;
                        }

                        const arrayValue = value === null ?
                            [] :
                            value.split(options.arrayFormatSeparator).map(item => decode(item, options));

                        if (accumulator[key] === undefined) {
                            accumulator[key] = arrayValue;
                            return;
                        }

                        accumulator[key] = [].concat(accumulator[key], arrayValue);
                    };

                default:
                    return (key, value, accumulator) => {
                        if (accumulator[key] === undefined) {
                            accumulator[key] = value;
                            return;
                        }

                        accumulator[key] = [].concat(accumulator[key], value);
                    };
            }
        }

        function validateArrayFormatSeparator(value) {
            if (typeof value !== 'string' || value.length !== 1) {
                throw new TypeError('arrayFormatSeparator must be single character string');
            }
        }

        function encode(value, options) {
            if (options.encode) {
                return options.strict ? strictUriEncode(value) : encodeURIComponent(value);
            }

            return value;
        }

        function decode(value, options) {
            if (options.decode) {
                return decodeComponent(value);
            }

            return value;
        }

        function keysSorter(input) {
            if (Array.isArray(input)) {
                return input.sort();
            }

            if (typeof input === 'object') {
                return keysSorter(Object.keys(input))
                    .sort((a, b) => Number(a) - Number(b))
                    .map(key => input[key]);
            }

            return input;
        }

        function removeHash(input) {
            const hashStart = input.indexOf('#');
            if (hashStart !== -1) {
                input = input.slice(0, hashStart);
            }

            return input;
        }

        function getHash(url) {
            let hash = '';
            const hashStart = url.indexOf('#');
            if (hashStart !== -1) {
                hash = url.slice(hashStart);
            }

            return hash;
        }

        function extract(input) {
            input = removeHash(input);
            const queryStart = input.indexOf('?');
            if (queryStart === -1) {
                return '';
            }

            return input.slice(queryStart + 1);
        }

        function parseValue(value, options) {
            if (options.parseNumbers && !Number.isNaN(Number(value)) && (typeof value === 'string' && value.trim() !== '')) {
                value = Number(value);
            } else if (options.parseBooleans && value !== null && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
                value = value.toLowerCase() === 'true';
            }

            return value;
        }

        function parse(query, options) {
            options = Object.assign({
                decode: true,
                sort: true,
                arrayFormat: 'none',
                arrayFormatSeparator: ',',
                parseNumbers: false,
                parseBooleans: false
            }, options);

            validateArrayFormatSeparator(options.arrayFormatSeparator);

            const formatter = parserForArrayFormat(options);

            // Create an object with no prototype
            const ret = Object.create(null);

            if (typeof query !== 'string') {
                return ret;
            }

            query = query.trim().replace(/^[?#&]/, '');

            if (!query) {
                return ret;
            }

            for (const param of query.split('&')) {
                if (param === '') {
                    continue;
                }

                let [key, value] = splitOnFirst(options.decode ? param.replace(/\+/g, ' ') : param, '=');

                // Missing `=` should be `null`:
                // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
                value = value === undefined ? null : ['comma', 'separator', 'bracket-separator'].includes(options.arrayFormat) ? value : decode(value, options);
                formatter(decode(key, options), value, ret);
            }

            for (const key of Object.keys(ret)) {
                const value = ret[key];
                if (typeof value === 'object' && value !== null) {
                    for (const k of Object.keys(value)) {
                        value[k] = parseValue(value[k], options);
                    }
                } else {
                    ret[key] = parseValue(value, options);
                }
            }

            if (options.sort === false) {
                return ret;
            }

            return (options.sort === true ? Object.keys(ret).sort() : Object.keys(ret).sort(options.sort)).reduce((result, key) => {
                const value = ret[key];
                if (Boolean(value) && typeof value === 'object' && !Array.isArray(value)) {
                    // Sort object keys, not values
                    result[key] = keysSorter(value);
                } else {
                    result[key] = value;
                }

                return result;
            }, Object.create(null));
        }

        exports.extract = extract;
        exports.parse = parse;

        exports.stringify = (object, options) => {
            if (!object) {
                return '';
            }

            options = Object.assign({
                encode: true,
                strict: true,
                arrayFormat: 'none',
                arrayFormatSeparator: ','
            }, options);

            validateArrayFormatSeparator(options.arrayFormatSeparator);

            const shouldFilter = key => (
                (options.skipNull && isNullOrUndefined(object[key])) ||
                (options.skipEmptyString && object[key] === '')
            );

            const formatter = encoderForArrayFormat(options);

            const objectCopy = {};

            for (const key of Object.keys(object)) {
                if (!shouldFilter(key)) {
                    objectCopy[key] = object[key];
                }
            }

            const keys = Object.keys(objectCopy);

            if (options.sort !== false) {
                keys.sort(options.sort);
            }

            return keys.map(key => {
                const value = object[key];

                if (value === undefined) {
                    return '';
                }

                if (value === null) {
                    return encode(key, options);
                }

                if (Array.isArray(value)) {
                    if (value.length === 0 && options.arrayFormat === 'bracket-separator') {
                        return encode(key, options) + '[]';
                    }

                    return value
                        .reduce(formatter(key), [])
                        .join('&');
                }

                return encode(key, options) + '=' + encode(value, options);
            }).filter(x => x.length > 0).join('&');
        };

        exports.parseUrl = (url, options) => {
            options = Object.assign({
                decode: true
            }, options);

            const [url_, hash] = splitOnFirst(url, '#');

            return Object.assign(
                {
                    url: url_.split('?')[0] || '',
                    query: parse(extract(url), options)
                },
                options && options.parseFragmentIdentifier && hash ? { fragmentIdentifier: decode(hash, options) } : {}
            );
        };

        exports.stringifyUrl = (object, options) => {
            options = Object.assign({
                encode: true,
                strict: true,
                [encodeFragmentIdentifier]: true
            }, options);

            const url = removeHash(object.url).split('?')[0] || '';
            const queryFromUrl = exports.extract(object.url);
            const parsedQueryFromUrl = exports.parse(queryFromUrl, { sort: false });

            const query = Object.assign(parsedQueryFromUrl, object.query);
            let queryString = exports.stringify(query, options);
            if (queryString) {
                queryString = `?${queryString}`;
            }

            let hash = getHash(object.url);
            if (object.fragmentIdentifier) {
                hash = `#${options[encodeFragmentIdentifier] ? encode(object.fragmentIdentifier, options) : object.fragmentIdentifier}`;
            }

            return `${url}${queryString}${hash}`;
        };

        exports.pick = (input, filter, options) => {
            options = Object.assign({
                parseFragmentIdentifier: true,
                [encodeFragmentIdentifier]: false
            }, options);

            const { url, query, fragmentIdentifier } = exports.parseUrl(input, options);
            return exports.stringifyUrl({
                url,
                query: filterObject(query, filter),
                fragmentIdentifier
            }, options);
        };

        exports.exclude = (input, filter, options) => {
            const exclusionFilter = Array.isArray(filter) ? key => !filter.includes(key) : (key, value) => !filter(key, value);

            return exports.pick(input, exclusionFilter, options);
        };

    }, { "decode-uri-component": 2, "filter-obj": 3, "split-on-first": 5, "strict-uri-encode": 6 }], 5: [function (require, module, exports) {
        'use strict';

        module.exports = (string, separator) => {
            if (!(typeof string === 'string' && typeof separator === 'string')) {
                throw new TypeError('Expected the arguments to be of type `string`');
            }

            if (separator === '') {
                return [string];
            }

            const separatorIndex = string.indexOf(separator);

            if (separatorIndex === -1) {
                return [string];
            }

            return [
                string.slice(0, separatorIndex),
                string.slice(separatorIndex + separator.length)
            ];
        };

    }, {}], 6: [function (require, module, exports) {
        'use strict';
        module.exports = str => encodeURIComponent(str).replace(/[!'()*]/g, x => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);

    }, {}], 7: [function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "v1", {
            enumerable: true,
            get: function () {
                return _v.default;
            }
        });
        Object.defineProperty(exports, "v3", {
            enumerable: true,
            get: function () {
                return _v2.default;
            }
        });
        Object.defineProperty(exports, "v4", {
            enumerable: true,
            get: function () {
                return _v3.default;
            }
        });
        Object.defineProperty(exports, "v5", {
            enumerable: true,
            get: function () {
                return _v4.default;
            }
        });
        Object.defineProperty(exports, "NIL", {
            enumerable: true,
            get: function () {
                return _nil.default;
            }
        });
        Object.defineProperty(exports, "version", {
            enumerable: true,
            get: function () {
                return _version.default;
            }
        });
        Object.defineProperty(exports, "validate", {
            enumerable: true,
            get: function () {
                return _validate.default;
            }
        });
        Object.defineProperty(exports, "stringify", {
            enumerable: true,
            get: function () {
                return _stringify.default;
            }
        });
        Object.defineProperty(exports, "parse", {
            enumerable: true,
            get: function () {
                return _parse.default;
            }
        });

        var _v = _interopRequireDefault(require("./v1.js"));

        var _v2 = _interopRequireDefault(require("./v3.js"));

        var _v3 = _interopRequireDefault(require("./v4.js"));

        var _v4 = _interopRequireDefault(require("./v5.js"));

        var _nil = _interopRequireDefault(require("./nil.js"));

        var _version = _interopRequireDefault(require("./version.js"));

        var _validate = _interopRequireDefault(require("./validate.js"));

        var _stringify = _interopRequireDefault(require("./stringify.js"));

        var _parse = _interopRequireDefault(require("./parse.js"));

        function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
    }, { "./nil.js": 9, "./parse.js": 10, "./stringify.js": 14, "./v1.js": 15, "./v3.js": 16, "./v4.js": 18, "./v5.js": 19, "./validate.js": 20, "./version.js": 21 }], 8: [function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.default = void 0;

        /*
         * Browser-compatible JavaScript MD5
         *
         * Modification of JavaScript MD5
         * https://github.com/blueimp/JavaScript-MD5
         *
         * Copyright 2011, Sebastian Tschan
         * https://blueimp.net
         *
         * Licensed under the MIT license:
         * https://opensource.org/licenses/MIT
         *
         * Based on
         * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
         * Digest Algorithm, as defined in RFC 1321.
         * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
         * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
         * Distributed under the BSD License
         * See http://pajhome.org.uk/crypt/md5 for more info.
         */
        function md5(bytes) {
            if (typeof bytes === 'string') {
                const msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

                bytes = new Uint8Array(msg.length);

                for (let i = 0; i < msg.length; ++i) {
                    bytes[i] = msg.charCodeAt(i);
                }
            }

            return md5ToHexEncodedArray(wordsToMd5(bytesToWords(bytes), bytes.length * 8));
        }
        /*
         * Convert an array of little-endian words to an array of bytes
         */


        function md5ToHexEncodedArray(input) {
            const output = [];
            const length32 = input.length * 32;
            const hexTab = '0123456789abcdef';

            for (let i = 0; i < length32; i += 8) {
                const x = input[i >> 5] >>> i % 32 & 0xff;
                const hex = parseInt(hexTab.charAt(x >>> 4 & 0x0f) + hexTab.charAt(x & 0x0f), 16);
                output.push(hex);
            }

            return output;
        }
        /**
         * Calculate output length with padding and bit length
         */


        function getOutputLength(inputLength8) {
            return (inputLength8 + 64 >>> 9 << 4) + 14 + 1;
        }
        /*
         * Calculate the MD5 of an array of little-endian words, and a bit length.
         */


        function wordsToMd5(x, len) {
            /* append padding */
            x[len >> 5] |= 0x80 << len % 32;
            x[getOutputLength(len) - 1] = len;
            let a = 1732584193;
            let b = -271733879;
            let c = -1732584194;
            let d = 271733878;

            for (let i = 0; i < x.length; i += 16) {
                const olda = a;
                const oldb = b;
                const oldc = c;
                const oldd = d;
                a = md5ff(a, b, c, d, x[i], 7, -680876936);
                d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
                c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
                b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
                a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
                d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
                c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
                b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
                a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
                d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
                c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
                b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
                a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
                d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
                c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
                b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
                a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
                d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
                c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
                b = md5gg(b, c, d, a, x[i], 20, -373897302);
                a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
                d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
                c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
                b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
                a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
                d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
                c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
                b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
                a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
                d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
                c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
                b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
                a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
                d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
                c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
                b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
                a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
                d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
                c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
                b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
                a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
                d = md5hh(d, a, b, c, x[i], 11, -358537222);
                c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
                b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
                a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
                d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
                c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
                b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
                a = md5ii(a, b, c, d, x[i], 6, -198630844);
                d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
                c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
                b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
                a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
                d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
                c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
                b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
                a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
                d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
                c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
                b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
                a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
                d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
                c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
                b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
                a = safeAdd(a, olda);
                b = safeAdd(b, oldb);
                c = safeAdd(c, oldc);
                d = safeAdd(d, oldd);
            }

            return [a, b, c, d];
        }
        /*
         * Convert an array bytes to an array of little-endian words
         * Characters >255 have their high-byte silently ignored.
         */


        function bytesToWords(input) {
            if (input.length === 0) {
                return [];
            }

            const length8 = input.length * 8;
            const output = new Uint32Array(getOutputLength(length8));

            for (let i = 0; i < length8; i += 8) {
                output[i >> 5] |= (input[i / 8] & 0xff) << i % 32;
            }

            return output;
        }
        /*
         * Add integers, wrapping at 2^32. This uses 16-bit operations internally
         * to work around bugs in some JS interpreters.
         */


        function safeAdd(x, y) {
            const lsw = (x & 0xffff) + (y & 0xffff);
            const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return msw << 16 | lsw & 0xffff;
        }
        /*
         * Bitwise rotate a 32-bit number to the left.
         */


        function bitRotateLeft(num, cnt) {
            return num << cnt | num >>> 32 - cnt;
        }
        /*
         * These functions implement the four basic operations the algorithm uses.
         */


        function md5cmn(q, a, b, x, s, t) {
            return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
        }

        function md5ff(a, b, c, d, x, s, t) {
            return md5cmn(b & c | ~b & d, a, b, x, s, t);
        }

        function md5gg(a, b, c, d, x, s, t) {
            return md5cmn(b & d | c & ~d, a, b, x, s, t);
        }

        function md5hh(a, b, c, d, x, s, t) {
            return md5cmn(b ^ c ^ d, a, b, x, s, t);
        }

        function md5ii(a, b, c, d, x, s, t) {
            return md5cmn(c ^ (b | ~d), a, b, x, s, t);
        }

        var _default = md5;
        exports.default = _default;
    }, {}], 9: [function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.default = void 0;
        var _default = '00000000-0000-0000-0000-000000000000';
        exports.default = _default;
    }, {}], 10: [function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.default = void 0;

        var _validate = _interopRequireDefault(require("./validate.js"));

        function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

        function parse(uuid) {
            if (!(0, _validate.default)(uuid)) {
                throw TypeError('Invalid UUID');
            }

            let v;
            const arr = new Uint8Array(16); // Parse ########-....-....-....-............

            arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
            arr[1] = v >>> 16 & 0xff;
            arr[2] = v >>> 8 & 0xff;
            arr[3] = v & 0xff; // Parse ........-####-....-....-............

            arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
            arr[5] = v & 0xff; // Parse ........-....-####-....-............

            arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
            arr[7] = v & 0xff; // Parse ........-....-....-####-............

            arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
            arr[9] = v & 0xff; // Parse ........-....-....-....-############
            // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

            arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
            arr[11] = v / 0x100000000 & 0xff;
            arr[12] = v >>> 24 & 0xff;
            arr[13] = v >>> 16 & 0xff;
            arr[14] = v >>> 8 & 0xff;
            arr[15] = v & 0xff;
            return arr;
        }

        var _default = parse;
        exports.default = _default;
    }, { "./validate.js": 20 }], 11: [function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.default = void 0;
        var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
        exports.default = _default;
    }, {}], 12: [function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.default = rng;
        // Unique ID creation requires a high quality random # generator. In the browser we therefore
        // require the crypto API and do not support built-in fallback to lower quality random number
        // generators (like Math.random()).
        let getRandomValues;
        const rnds8 = new Uint8Array(16);

        function rng() {
            // lazy load so that environments that need to polyfill have a chance to do so
            if (!getRandomValues) {
                // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
                // find the complete implementation of crypto (msCrypto) on IE11.
                getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

                if (!getRandomValues) {
                    throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
                }
            }

            return getRandomValues(rnds8);
        }
    }, {}], 13: [function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.default = void 0;

        // Adapted from Chris Veness' SHA1 code at
        // http://www.movable-type.co.uk/scripts/sha1.html
        function f(s, x, y, z) {
            switch (s) {
                case 0:
                    return x & y ^ ~x & z;

                case 1:
                    return x ^ y ^ z;

                case 2:
                    return x & y ^ x & z ^ y & z;

                case 3:
                    return x ^ y ^ z;
            }
        }

        function ROTL(x, n) {
            return x << n | x >>> 32 - n;
        }

        function sha1(bytes) {
            const K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
            const H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];

            if (typeof bytes === 'string') {
                const msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

                bytes = [];

                for (let i = 0; i < msg.length; ++i) {
                    bytes.push(msg.charCodeAt(i));
                }
            } else if (!Array.isArray(bytes)) {
                // Convert Array-like to Array
                bytes = Array.prototype.slice.call(bytes);
            }

            bytes.push(0x80);
            const l = bytes.length / 4 + 2;
            const N = Math.ceil(l / 16);
            const M = new Array(N);

            for (let i = 0; i < N; ++i) {
                const arr = new Uint32Array(16);

                for (let j = 0; j < 16; ++j) {
                    arr[j] = bytes[i * 64 + j * 4] << 24 | bytes[i * 64 + j * 4 + 1] << 16 | bytes[i * 64 + j * 4 + 2] << 8 | bytes[i * 64 + j * 4 + 3];
                }

                M[i] = arr;
            }

            M[N - 1][14] = (bytes.length - 1) * 8 / Math.pow(2, 32);
            M[N - 1][14] = Math.floor(M[N - 1][14]);
            M[N - 1][15] = (bytes.length - 1) * 8 & 0xffffffff;

            for (let i = 0; i < N; ++i) {
                const W = new Uint32Array(80);

                for (let t = 0; t < 16; ++t) {
                    W[t] = M[i][t];
                }

                for (let t = 16; t < 80; ++t) {
                    W[t] = ROTL(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);
                }

                let a = H[0];
                let b = H[1];
                let c = H[2];
                let d = H[3];
                let e = H[4];

                for (let t = 0; t < 80; ++t) {
                    const s = Math.floor(t / 20);
                    const T = ROTL(a, 5) + f(s, b, c, d) + e + K[s] + W[t] >>> 0;
                    e = d;
                    d = c;
                    c = ROTL(b, 30) >>> 0;
                    b = a;
                    a = T;
                }

                H[0] = H[0] + a >>> 0;
                H[1] = H[1] + b >>> 0;
                H[2] = H[2] + c >>> 0;
                H[3] = H[3] + d >>> 0;
                H[4] = H[4] + e >>> 0;
            }

            return [H[0] >> 24 & 0xff, H[0] >> 16 & 0xff, H[0] >> 8 & 0xff, H[0] & 0xff, H[1] >> 24 & 0xff, H[1] >> 16 & 0xff, H[1] >> 8 & 0xff, H[1] & 0xff, H[2] >> 24 & 0xff, H[2] >> 16 & 0xff, H[2] >> 8 & 0xff, H[2] & 0xff, H[3] >> 24 & 0xff, H[3] >> 16 & 0xff, H[3] >> 8 & 0xff, H[3] & 0xff, H[4] >> 24 & 0xff, H[4] >> 16 & 0xff, H[4] >> 8 & 0xff, H[4] & 0xff];
        }

        var _default = sha1;
        exports.default = _default;
    }, {}], 14: [function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.default = void 0;

        var _validate = _interopRequireDefault(require("./validate.js"));

        function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

        /**
         * Convert array of 16 byte values to UUID string format of the form:
         * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
         */
        const byteToHex = [];

        for (let i = 0; i < 256; ++i) {
            byteToHex.push((i + 0x100).toString(16).substr(1));
        }

        function stringify(arr, offset = 0) {
            // Note: Be careful editing this code!  It's been tuned for performance
            // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
            const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
            // of the following:
            // - One or more input array values don't map to a hex octet (leading to
            // "undefined" in the uuid)
            // - Invalid input values for the RFC `version` or `variant` fields

            if (!(0, _validate.default)(uuid)) {
                throw TypeError('Stringified UUID is invalid');
            }

            return uuid;
        }

        var _default = stringify;
        exports.default = _default;
    }, { "./validate.js": 20 }], 15: [function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.default = void 0;

        var _rng = _interopRequireDefault(require("./rng.js"));

        var _stringify = _interopRequireDefault(require("./stringify.js"));

        function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

        // **`v1()` - Generate time-based UUID**
        //
        // Inspired by https://github.com/LiosK/UUID.js
        // and http://docs.python.org/library/uuid.html
        let _nodeId;

        let _clockseq; // Previous uuid creation time


        let _lastMSecs = 0;
        let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

        function v1(options, buf, offset) {
            let i = buf && offset || 0;
            const b = buf || new Array(16);
            options = options || {};
            let node = options.node || _nodeId;
            let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
            // specified.  We do this lazily to minimize issues related to insufficient
            // system entropy.  See #189

            if (node == null || clockseq == null) {
                const seedBytes = options.random || (options.rng || _rng.default)();

                if (node == null) {
                    // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
                    node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
                }

                if (clockseq == null) {
                    // Per 4.2.2, randomize (14 bit) clockseq
                    clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
                }
            } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
            // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
            // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
            // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


            let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
            // cycle to simulate higher resolution clock

            let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

            const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

            if (dt < 0 && options.clockseq === undefined) {
                clockseq = clockseq + 1 & 0x3fff;
            } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
            // time interval


            if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
                nsecs = 0;
            } // Per 4.2.1.2 Throw error if too many uuids are requested


            if (nsecs >= 10000) {
                throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
            }

            _lastMSecs = msecs;
            _lastNSecs = nsecs;
            _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

            msecs += 12219292800000; // `time_low`

            const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
            b[i++] = tl >>> 24 & 0xff;
            b[i++] = tl >>> 16 & 0xff;
            b[i++] = tl >>> 8 & 0xff;
            b[i++] = tl & 0xff; // `time_mid`

            const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
            b[i++] = tmh >>> 8 & 0xff;
            b[i++] = tmh & 0xff; // `time_high_and_version`

            b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

            b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

            b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

            b[i++] = clockseq & 0xff; // `node`

            for (let n = 0; n < 6; ++n) {
                b[i + n] = node[n];
            }

            return buf || (0, _stringify.default)(b);
        }

        var _default = v1;
        exports.default = _default;
    }, { "./rng.js": 12, "./stringify.js": 14 }], 16: [function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.default = void 0;

        var _v = _interopRequireDefault(require("./v35.js"));

        var _md = _interopRequireDefault(require("./md5.js"));

        function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

        const v3 = (0, _v.default)('v3', 0x30, _md.default);
        var _default = v3;
        exports.default = _default;
    }, { "./md5.js": 8, "./v35.js": 17 }], 17: [function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.default = _default;
        exports.URL = exports.DNS = void 0;

        var _stringify = _interopRequireDefault(require("./stringify.js"));

        var _parse = _interopRequireDefault(require("./parse.js"));

        function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

        function stringToBytes(str) {
            str = unescape(encodeURIComponent(str)); // UTF8 escape

            const bytes = [];

            for (let i = 0; i < str.length; ++i) {
                bytes.push(str.charCodeAt(i));
            }

            return bytes;
        }

        const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
        exports.DNS = DNS;
        const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
        exports.URL = URL;

        function _default(name, version, hashfunc) {
            function generateUUID(value, namespace, buf, offset) {
                if (typeof value === 'string') {
                    value = stringToBytes(value);
                }

                if (typeof namespace === 'string') {
                    namespace = (0, _parse.default)(namespace);
                }

                if (namespace.length !== 16) {
                    throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
                } // Compute hash of namespace and value, Per 4.3
                // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
                // hashfunc([...namespace, ... value])`


                let bytes = new Uint8Array(16 + value.length);
                bytes.set(namespace);
                bytes.set(value, namespace.length);
                bytes = hashfunc(bytes);
                bytes[6] = bytes[6] & 0x0f | version;
                bytes[8] = bytes[8] & 0x3f | 0x80;

                if (buf) {
                    offset = offset || 0;

                    for (let i = 0; i < 16; ++i) {
                        buf[offset + i] = bytes[i];
                    }

                    return buf;
                }

                return (0, _stringify.default)(bytes);
            } // Function#name is not settable on some platforms (#270)


            try {
                generateUUID.name = name; // eslint-disable-next-line no-empty
            } catch (err) { } // For CommonJS default export support


            generateUUID.DNS = DNS;
            generateUUID.URL = URL;
            return generateUUID;
        }
    }, { "./parse.js": 10, "./stringify.js": 14 }], 18: [function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.default = void 0;

        var _rng = _interopRequireDefault(require("./rng.js"));

        var _stringify = _interopRequireDefault(require("./stringify.js"));

        function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

        function v4(options, buf, offset) {
            options = options || {};

            const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


            rnds[6] = rnds[6] & 0x0f | 0x40;
            rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

            if (buf) {
                offset = offset || 0;

                for (let i = 0; i < 16; ++i) {
                    buf[offset + i] = rnds[i];
                }

                return buf;
            }

            return (0, _stringify.default)(rnds);
        }

        var _default = v4;
        exports.default = _default;
    }, { "./rng.js": 12, "./stringify.js": 14 }], 19: [function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.default = void 0;

        var _v = _interopRequireDefault(require("./v35.js"));

        var _sha = _interopRequireDefault(require("./sha1.js"));

        function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

        const v5 = (0, _v.default)('v5', 0x50, _sha.default);
        var _default = v5;
        exports.default = _default;
    }, { "./sha1.js": 13, "./v35.js": 17 }], 20: [function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.default = void 0;

        var _regex = _interopRequireDefault(require("./regex.js"));

        function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

        function validate(uuid) {
            return typeof uuid === 'string' && _regex.default.test(uuid);
        }

        var _default = validate;
        exports.default = _default;
    }, { "./regex.js": 11 }], 21: [function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.default = void 0;

        var _validate = _interopRequireDefault(require("./validate.js"));

        function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

        function version(uuid) {
            if (!(0, _validate.default)(uuid)) {
                throw TypeError('Invalid UUID');
            }

            return parseInt(uuid.substr(14, 1), 16);
        }

        var _default = version;
        exports.default = _default;
    }, { "./validate.js": 20 }]
}, {}, [1]);