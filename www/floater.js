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
      let activeClass = ref("active");
      let covervisible = ref(false);
      let showModal = ref(false);
      let clickCounter = ref(0);
      console.log(props);

      return {
        message,
        props,
        clickCounter,
        covervisible,
        showModal,
        activeClass
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
        this.showModal = false;
        this.covervisible = false;
      },
      openModal() {
        this.showModal = true;
      },
      closeModal() {
        this.showModal = false;
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
          <div><span @click="openModal">I have a question about my order</span></div>
          <div><span @click="openModal">I would like someone to contact me</span></div>
      </div>

      <div id="modal" :class="showModal && activeClass">
        <div class="modal-content">
          <div class="header">
            <h2>Please enter this form</h2>
            <span class="close" @click="closeModal">&times;</span>
          </div>
          <div class="body">
            <h2>Modal Body</h2>
            <p>
            This is the body of a modal that I made with pure CSS. There is also some VueJS in use. and there is some HTML.
            The CSS is the magic ingredient here.
            </p>
          </div>
          <div class="footer">
          The footer
          </div>
        </div>
      </div>

    </div><!-- #cover -->
    `

  };

  const app = createApp(component, { ...mountElement.dataset });
  app.mount("#" + mountElementId);
};

setTimeout(runApp, 1000);
