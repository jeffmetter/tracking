(function () {

	function getHash(key) {
		var query = window.location.hash.substring(1);
		var pars = query.split("&");
		for (var i = 0; i < pars.length; i++) {
			var values = pars[i].split("=");
			if (values[0] == key) return values[1];
		}
		return (false);
	}

	function getQuery(key) {
		var query = window.location.search.substring(1);
		var pars = query.split("&");
		for (var i = 0; i < pars.length; i++) {
			var values = pars[i].split("=");
			if (values[0] == key) return values[1];
		}
		return (false);
	}

	function setCookie(name, value, expires, domain) {
		var cookie = name + "=" + value + ";";
		if (expires) {
			var d = new Date();
			d.setTime(d.getTime() + (expires*24*60*60*1000));
			cookie += "expires=" + d.toUTCString() + ";";
		}
		cookie += "domain=" + domain + ";";
		cookie += "path=/";
		document.cookie = cookie;
	}

	function getCookie(name) {
		var name = name + "=";
		var ca = document.cookie.split(";");
		for(var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0)==" ") c = c.substring(1);
			if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
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
		}
	}

	function Referral(source, medium, term, content, campaign) {
		this.source = source;
		this.medium = medium;
		this.term = term;
		this.content = content;
		this.campaign = campaign;
	}

	function getReferral(domain) {

		var ref = document.referrer,
			hs = getHash("utm_source"),
			hm = getHash("utm_medium"),
			ht = getHash("utm_term"),
			hc = getHash("utm_content"),
			hn = getHash("utm_campaign"),
			qs = getQuery("utm_source"),
			qm = getQuery("utm_medium"),
			qt = getQuery("utm_term"),
			qc = getQuery("utm_content"),
			qn = getQuery("utm_campaign"),
			n = false;

		if (hs || hm || ht || hc || hn) {

			if (!hs) hs = "-";
			if (!hm) hm = "-";
			if (!ht) ht = "-";
			if (!hc) hc = "-";
			if (!hn) hn = "-";
			n = new Referral(hs, hm, ht, hc, hn);

		} else if (qs || qm || qt || qc || qn) {

			if (!qs) qs = "-";
			if (!qm) qm = "-";
			if (!qt) qt = "-";
			if (!qc) qc = "-";
			if (!qn) qn = "-";
			n = new Referral(qs, qm, qt, qc, qn);

		} else if (ref && ref.indexOf(domain) == -1) {

			n = new Referral(ref, "-", "-", "-", "-");

		}

		return n;

	}

	(function () {

		var nr = getReferral(mi_td),
			fr = getCookie("mi_first_referral"),
			lr = getCookie("mi_last_referral"),
			tf = false,
			tl = false;

		if (fr) {
			tf = JSON.parse(fr);
		} else if (nr) {
			tf = nr;
			setCookie("mi_first_referral", JSON.stringify(tf), 180, mi_td);
		} else {
			tf = new Referral("Web Form", "-", "-", "-", "-");
			setCookie("mi_first_referral", JSON.stringify(tf), 180, mi_td);
		}

		if (lr) {
			tl = JSON.parse(lr);
		} else if (nr) {
			tl = nr;
			setCookie("mi_last_referral", JSON.stringify(tl), false, mi_td);
		} else {
			tl = new Referral("Web Form", "-", "-", "-", "-");
			setCookie("mi_last_referral", JSON.stringify(tl), false, mi_td);
		}

		if (tf && tl) {

			// populate form inputs

			function setValue(iname, ivalue) {
				var input = document.getElementsByName(iname);
				for (var i = 0; i < input.length; i++) {
					input[i].value = ivalue;
				}
			}

			setValue(mi_fs, tf["source"]);
			setValue(mi_fm, tf["medium"]);
			setValue(mi_ft, tf["term"]);
			setValue(mi_fc, tf["content"]);
			setValue(mi_fn, tf["campaign"]);
			setValue(mi_ls, tl["source"]);
			setValue(mi_lm, tl["medium"]);
			setValue(mi_lt, tl["term"]);
			setValue(mi_lc, tl["content"]);
			setValue(mi_ln, tl["campaign"]);

			// populate pardot iframes

			function setUrl (domain) {
				var iframes = document.getElementsByTagName("iframe");
				for (var i = 0; i < iframes.length; i++) {
					if (iframes[i].src && iframes[i].src.indexOf(domain) > -1) {

						var amp = (iframes[i].src.indexOf("?") > -1 ? "&" : "?");
						var url = iframes[i].src;

						url += amp+mi_fs+"="+encodeURI(tf["source"]);
						url += "&"+mi_fm+"="+encodeURI(tf["medium"]);
						url += "&"+mi_ft+"="+encodeURI(tf["term"]);
						url += "&"+mi_fc+"="+encodeURI(tf["content"]);
						url += "&"+mi_fn+"="+encodeURI(tf["campaign"]);
						url += "&"+mi_ls+"="+encodeURI(tl["source"]);
						url += "&"+mi_lm+"="+encodeURI(tl["medium"]);
						url += "&"+mi_lt+"="+encodeURI(tl["term"]);
						url += "&"+mi_lc+"="+encodeURI(tl["content"]);
						url += "&"+mi_ln+"="+encodeURI(tl["campaign"]);

						iframes[i].src = url;

					}
				}
			}

			if (mi_pu) {
				setUrl(mi_pu);
			}

		}

		removeUtms();

	})();

})();
