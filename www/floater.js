function loadStyle() {
  var link = document.createElement("link");
  link.href = "floater.css";
  link.type = "text/css";
  link.rel = "stylesheet";
  document.getElementsByTagName("head")[0].appendChild(link);
}

function loadIcons() {
  var link = document.createElement("link");
  link.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
  link.type = "text/css";
  link.rel = "stylesheet";
  document.getElementsByTagName("head")[0].appendChild(link);
}

async function runApp() {
  const { createApp, ref, defineProps } = await import(
    "https://cdnjs.cloudflare.com/ajax/libs/vue/3.3.8/vue.esm-browser.prod.min.js"
  );

  loadStyle();
  loadIcons();

  const mountElementId = "floater-app";
  const mountElement = document.getElementById(mountElementId);

  const component = {

    setup(props) {
      let message = ref("Hello Vue 🚀");
      let covervisible = ref(false);
      let clickCounter = ref(0);
      console.log(props);

      return {
        message,
        props,
        clickCounter,
        covervisible
      };
    },

    mounted() {
      console.log("component mounted");
      // const floatercheckbox = document.getElementById("floatercheckbox");
      // document.getElementById("cover").addEventListener("click", () => { floatercheckbox.checked = false; });
    },

    methods: {
      handleButton() {
        this.clickCounter++;
        this.message = "The button was clicked";
      },
      hidecover() {
        this.covervisible = false;
      }
    },

    computed: {
      twopi() {
        return this.props.pi * 2;
      },

      myFlag() {
        return this.props.flag.toLowerCase() === "true";
      }
    },

    props: {
      lang: String,
      mode: String,
      pi: Number,
      flag: Boolean
    },

    template: `

    <div class="container">
      <h1>VUE</h1>
      <div class="row">
        <div>
          <span>Testing an all-in-one-file component with VueJS.</span>
        </div>
      </div>

      <div class="row">

        <div>
          <span class="bordered">{{ message }}</span>
        </div>

      </div>

      <div class="row">

        <div>
          <span class="bordered">Click Count: {{ clickCounter }}</span>
        </div>

      </div>

      <div class="row">
        <button class="primary" type="button" @click="handleButton">Click <span class="icon-user"></span></button>
      </div>

      <div class="row">

        <pre>
          Mode: {{ mode }}
          PI: {{ pi }}
          TAU: {{ twopi }}</pre>

      </div>

      <span class="toast" v-if="myFlag">
        The flag is True
      </span>

      <span class="toast" v-if="!myFlag">
        The flag is False
      </span>

    </div>
    
    <input id="floatercheckbox" v-model="covervisible" type="checkbox" role="button" class="floatercheckbox" />

    <label id="float" for="floatercheckbox">
      <i class="material-icons md-24">contact_support</i><span class="my-float">I have a question </span>
    </label>

    <div id="cover" @click.self="hidecover">
      <div class="floatmenu">
          <div><span @click="handleButton">I have a question about my order</span></div>
          <div><span @click="handleButton">I would like someone to contact me</span></div>
      </div>
    </div>
    `

  };

  const app = createApp(component, { ...mountElement.dataset });
  app.mount("#" + mountElementId);
};

setTimeout(runApp, 1000);
