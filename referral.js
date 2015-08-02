(function () {

	function getHash(variable) {
		var query = window.location.hash.substring(1);
		var vars = query.split("&");
		for (var i = 0; i < vars.length; i++) {
		       var pair = vars[i].split("=");
		       if(pair[0] == variable){return pair[1];}
		}
		return(false);
	}

	function getQuery(variable) {
		var query = window.location.search.substring(1);
		var vars = query.split("&");
		for (var i = 0; i < vars.length; i++) {
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
		for (var i = 0; i < ca.length; i++) {
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
		new_referral,
		track_first,
		track_last,
		ref;

	// get cookies

	var last_cookie = getCookie("mi_last_referral");
	var first_cookie = getCookie("mi_first_referral");


	// referral class

	function Referral(source,medium,term,content,campaign) {
		this.source = source;
		this.medium = medium;
		this.term = term;
		this.content = content;
		this.campaign = campaign;
	}




	// check for new values

	if (hash_s || hash_m || hash_t || hash_c || hash_n) {

		if (!hash_s) hash_s = "-";
		if (!hash_m) hash_m = "-";
		if (!hash_t) hash_t = "-";
		if (!hash_c) hash_c = "-";
		if (!hash_n) hash_n = "-";

		new_referral = new Referral(hash_s, hash_m, hash_t, hash_c, hash_n);

	} else if (query_s || query_m || query_t || query_c || query_n) {

		if (!query_s) query_s = "-";
		if (!query_m) query_m = "-";
		if (!query_t) query_t = "-";
		if (!query_c) query_c = "-";
		if (!query_n) query_n = "-";

		new_referral = new Referral(query_s, query_m, query_t, query_c, query_n);

	} else if (doc_ref && doc_ref.indexOf(mi_td) == -1) {

		new_referral = new Referral(doc_ref, "-", "-", "-", "-");

	} else if (doc_ref.indexOf(mi_td) == -1) {

		new_referral = new Referral("Web Form", "-", "-", "-", "-");

	}

	// track last values

	if (new_referral) {

		track_last = new_referral;

		ref = JSON.stringify(new_referral);
		setCookie(mi_td, "mi_last_referral", ref);

	} else if (last_cookie) {

		track_last = JSON.parse(last_cookie);

	} 

	// track first values

	if (first_cookie) {

		track_first = JSON.parse(first_cookie);

	} else if (new_referral) {

		track_first = new_referral;

		ref = JSON.stringify(new_referral);
		setCookie(mi_td, "mi_first_referral", ref);

	} 

	if (track_first || track_last) {

		// populate form inputs

		function setValue(name, value) {
			var input = document.getElementsByName(name);
			for (var i = 0; i < input.length; i++) {
				input[i].value = value;
			}
		}

		setValue(mi_fs, track_first["source"]);
		setValue(mi_fm, track_first["medium"]);
		setValue(mi_ft, track_first["term"]);
		setValue(mi_fc, track_first["content"]);
		setValue(mi_fn, track_first["campaign"]);

		setValue(mi_ls, track_last["source"]);
		setValue(mi_lm, track_last["medium"]);
		setValue(mi_lt, track_last["term"]);
		setValue(mi_lc, track_last["content"]);
		setValue(mi_ln, track_last["campaign"]);

		// populate pardot iframes

		if (mi_pu) {
			var iframes = document.getElementsByTagName("iframe");
			for (var i = 0; i < iframes.length; i++) {
				if (iframes[i].src && iframes[i].src.indexOf(mi_pu) > -1) {

					var amp = (iframes[i].src.indexOf("?") > -1 ? "&" : "?");
					var track_pu = iframes[i].src;

					track_pu += amp+mi_fs+"="+track_first["source"];
					track_pu += "&"+mi_fm+"="+track_first["medium"];
					track_pu += "&"+mi_ft+"="+track_first["term"];
					track_pu += "&"+mi_fc+"="+track_first["content"];
					track_pu += "&"+mi_fn+"="+track_first["campaign"];
					track_pu += "&"+mi_ls+"="+track_last["source"];
					track_pu += "&"+mi_lm+"="+track_last["medium"];
					track_pu += "&"+mi_lt+"="+track_last["term"];
					track_pu += "&"+mi_lc+"="+track_last["content"];
					track_pu += "&"+mi_ln+"="+track_last["campaign"];

					iframes[i].src = track_pu;

				}
			}
		}

	}

	removeUtms();

})();