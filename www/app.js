class App {

   constructor()
   {
      this.boundButtonHandler = this.buttonhandler.bind(this)
      const btnset = document.getElementById("setcookiebutton");
      btnset.addEventListener("click", this.boundButtonHandler);

      const btnrefresh = document.getElementById("refreshbutton");
      btnrefresh.addEventListener("click", this.refreshhandler);

      const otherhosthidden = document.getElementById("otherhost");
      const otherporthidden = document.getElementById("otherport");
      this.otherhost = otherhosthidden.value;
      this.otherport = otherporthidden.value;
      console.log("other:", this.otherhost, this.otherport);
   }

   refreshhandler(e)
   {
      document.location.reload();
   }

   buttonhandler(e)
   {
      const nameinput = document.getElementById("cookiename");
      const valueinput = document.getElementById("cookievalue");
      console.log("button clicked", e.type);

      var myDate = new Date();
      myDate.setMonth(myDate.getMonth() + 12);

      const cookieName = nameinput.value;
      const cookieValue = valueinput.value;

      if (cookieName != ""  && cookieValue != "")
      {
         this.callothersite(this.otherhost, this.otherport, cookieName, cookieValue);
         // document.cookie = cookieName + "=" + cookieValue + ";expires=" + myDate + ";domain=.home.be;path=/";
      }
   }

   base64ToBytes(base64)
   {
      const binString = atob(base64);
      return Uint8Array.from(binString, (m) => m.codePointAt(0));
   }

   base64ToString(base64)
   {
      return new TextDecoder().decode(this.base64ToBytes(base64));
   }

   bytesToBase64(bytes)
   {
      const binString = String.fromCodePoint(...bytes);
      return btoa(binString);
   }

   stringToBase64(value)
   {
      return this.bytesToBase64(new TextEncoder().encode(value));
   }

   callothersite(host, port, cookiename, cookievalue)
   {
      let data = this.stringToBase64(cookiename + ":" + cookievalue);
      let url = "https://" + host + ":" + port + "/ping?data=" + data;
      fetch(url, { method: "GET", credentials: "include" })
        .then(response => response.json())
        .then(data => console.log(data));
   }
}

document.addEventListener("DOMContentLoaded", () => {
   const app = new App();
});
