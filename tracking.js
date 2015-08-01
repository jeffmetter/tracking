(function () {

	function getHash(variable) {
		var query = window.location.hash.substring(1);
		var vars = query.split("&");
		for (var i=0;i<vars.length;i++) {
		       var pair = vars[i].split("=");
		       if(pair[0] == variable){return pair[1];}
		}
		return(false);
	}

	function getQuery(variable) {
		var query = window.location.search.substring(1);
		var vars = query.split("&");
		for (var i=0;i<vars.length;i++) {
		       var pair = vars[i].split("=");
		       if(pair[0] == variable){return pair[1];}
		}
		return(false);
	}

	function setCookie(cdomain, cname, cvalue) {
		var now = new Date();
		var time = now.getTime();
		time += 180*24*60*60*1000;
		now.setTime(time);
		document.cookie = cname + "=" + cvalue + "; expires=" + now.toUTCString() + "; domain=" + cdomain + "; path=/";
	}

	function getCookie(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(";");
		for (var i=0; i<ca.length; i++) {
			var c = ca[i].trim();
			if (c.indexOf(name)==0) return c.substring(name.length,c.length);
		}
		return "";
	}

	function removeUtms() {
		var l = window.location;
		if (l.hash.indexOf("utm") != -1) {
			if (window.history.replaceState) {
				history.replaceState({}, "", l.pathname + l.search);
			} else {
				l.hash = "";
			}
		};
	}

	// variable declaration

	var doc_ref = document.referrer,
		hash_s = getHash("utm_source"),
		hash_m = getHash("utm_medium"),
		hash_t = getHash("utm_term"),
		hash_c = getHash("utm_content"),
		hash_n = getHash("utm_campaign"),
		query_s = getQuery("utm_source"),
		query_m = getQuery("utm_medium"),
		query_t = getQuery("utm_term"),
		query_c = getQuery("utm_content"),
		query_n = getQuery("utm_campaign"),
		new_s,
		new_m,
		new_t,
		new_c,
		new_n,
		track_fs,
		track_fm,
		track_ft,
		track_fc,
		track_fn,
		track_ls,
		track_lm,
		track_lt,
		track_lc,
		track_ln,
		last_cookie = false,
		first_cookie = false;

	// check for cookies

	if (getCookie("mi_last_source")) last_cookie = true;
	if (getCookie("mi_last_medium")) last_cookie = true;
	if (getCookie("mi_last_term")) last_cookie = true;
	if (getCookie("mi_last_content")) last_cookie = true;
	if (getCookie("mi_last_cmpaign")) last_cookie = true;

	if (getCookie("mi_first_source")) first_cookie = true;
	if (getCookie("mi_first_medium")) first_cookie = true;
	if (getCookie("mi_first_term")) first_cookie = true;
	if (getCookie("mi_first_content")) first_cookie = true;
	if (getCookie("mi_first_campaign")) first_cookie = true;

	// check for new values

	if (hash_s || hash_m || hash_t || hash_c || hash_n) {

		new_s = hash_s ? hash_s : "-";
		new_m = hash_m ? hash_m : "-";
		new_t = hash_t ? hash_t : "-";
		new_c = hash_c ? hash_c : "-";
		new_n = hash_n ? hash_n : "-";

	} else if (query_s || query_m || query_t || query_c || query_n) {

		new_s = query_s ? query_s : "-";
		new_m = query_m ? query_m : "-";
		new_t = query_t ? query_t : "-";
		new_c = query_c ? query_c : "-";
		new_n = query_n ? query_n : "-";

	} else if (doc_ref && doc_ref.indexOf(mi_td) == -1) {

		new_s = doc_ref;
		new_m = "-";
		new_t = "-";
		new_c = "-";
		new_n = "-";

	} else if (doc_ref.indexOf(mi_td) == -1) {

		new_s = "Web Form";
		new_m = "-";
		new_t = "-";
		new_c = "-";
		new_n = "-";

	}

	// track last values

	if (new_s || new_m || new_t || new_c || new_n) {

		var track_ls = new_s;
		var track_lm = new_m;
		var track_lt = new_t;
		var track_lc = new_c;
		var track_ln = new_n;

		setCookie(mi_td, "mi_last_source", new_s);
		setCookie(mi_td, "mi_last_medium", new_m);
		setCookie(mi_td, "mi_last_term", new_t);
		setCookie(mi_td, "mi_last_content", new_c);
		setCookie(mi_td, "mi_last_campaign", new_n);

	} else if (last_cookie) {

		var track_ls = getCookie("mi_last_source");
		var track_lm = getCookie("mi_last_medium");
		var track_lt = getCookie("mi_last_term");
		var track_lc = getCookie("mi_last_content");
		var track_ln = getCookie("mi_last_campaign");

	} 

	// track first values

	if (first_cookie) {

		var track_fs = getCookie("mi_first_source");
		var track_fm = getCookie("mi_first_medium");
		var track_ft = getCookie("mi_first_term");
		var track_fc = getCookie("mi_first_content");
		var track_fn = getCookie("mi_first_campaign");

	} else if (new_s || new_m || new_t || new_c || new_n) {

		var track_fs = new_s;
		var track_fm = new_m;
		var track_ft = new_t;
		var track_fc = new_c;
		var track_fn = new_n;

		setCookie(mi_td, "mi_first_source", new_s);
		setCookie(mi_td, "mi_first_medium", new_m);
		setCookie(mi_td, "mi_first_term", new_t);
		setCookie(mi_td, "mi_first_content", new_c);
		setCookie(mi_td, "mi_first_campaign", new_n);

	} 





	if (track_fs || track_fm || track_ft || track_fc || track_fn || track_ls || track_lm || track_lt || track_lc || track_ln) {

		function setValue(name, value) {
			var input = document.getElementsByName(name);
			for (var i = 0; i < input.length; i++) {
				input[i].value = value;
			}
		}

		setValue(mi_fs, track_fs);
		setValue(mi_fm, track_fm);
		setValue(mi_ft, track_ft);
		setValue(mi_fc, track_fc);
		setValue(mi_fn, track_fn);

		setValue(mi_ls, track_ls);
		setValue(mi_lm, track_lm);
		setValue(mi_lt, track_lt);
		setValue(mi_lc, track_lc);
		setValue(mi_ln, track_ln);




		var elements = document.getElementsByTagName("iframe");
		alert(elements[0].src);
		/*
		for (var i = 0; i < elements.length; i++) {
			//alert(elements[i].src);
		}​
		*/



		// populate form handler
		/*

		// append to pardot iframe url

		jQuery("iframe").each(function() {
			var iframeurl = jQuery(this).attr("src");
			var questamp = "?";
			if (iframeurl && iframeurl.indexOf(mi_pu) > -1) {
				if (iframeurl.indexOf("?") > -1) {
					questamp = "&";
				}
				jQuery(this).attr("src", iframeurl+questamp+"track_fs="+track_fs+"&track_fm="+track_fm+"&First_Term="+first_term+"&track_fc="+track_fc+"&track_fn="+track_fn+"&track_ls="+track_ls+"&track_lm="+track_lm+"&track_lt="+track_lt+"&track_lc="+track_lc+"&track_ln="+track_ln);
			}
		});
		*/

	}

	removeUtms();



})();
