type setupType = {
    message: string;
    clickCounter: number;
    coverVisible: boolean;
    modalVisible: boolean;
    activeClass: string;
    labels: {},
    props: propsType
};

type propsType = {
    lang: string;
    mode: string;
    pi: number;
    flag: boolean;
};

class Floater {

    mountElementId: string;

    constructor() {
        this.mountElementId = "floater-app";
    }

    loadStyle() {
        var link = document.createElement("link");
        link.href = "floater.css";
        link.type = "text/css";
        link.rel = "stylesheet";
        document.getElementsByTagName("head")[0].appendChild(link);
    }

    loadIcons() {
        var link = document.createElement("link");
        link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css";
        link.type = "text/css";
        link.rel = "stylesheet";
        document.getElementsByTagName("head")[0].appendChild(link);
    }

    async run() {
        const { createApp, ref, reactive } = await import(
            "https://cdnjs.cloudflare.com/ajax/libs/vue/3.3.8/vue.esm-browser.prod.min.js"
        );

        this.loadStyle();
        this.loadIcons();

        const mountElement = document.getElementById(this.mountElementId);
        if (mountElement === null) {
            console.error(`No DOM element found with id #{this.mountElementId}`);
            return;
        }

        const component = {
            setup(props: propsType): setupType {
                console.log("setup");
                let message = ref("VueJS Experiment !!");
                let activeClass = ref("active");
                let coverVisible = ref(false);
                let modalVisible = ref(false);
                let clickCounter = ref(0);
                let labels = ref({ floater_text: "", "question1": "", "question2": "" });

                fetch("/labels")
                    .then(response => response.json())
                    .then(data => { labels.value = data; console.log(labels.value); });

                return {
                    message,
                    props,
                    clickCounter,
                    coverVisible,
                    modalVisible,
                    activeClass,
                    labels
                };
            },
            mounted() {
                console.log("component mounted");
            },
            created() {
                console.log("component created");
            },
            props: {
                lang: { type: String, required: false, default: "en" },
                mode: { type: String, required: false },
                pi: { type: Number, required: false },
                flag: { type: Boolean, required: false },
            },
            methods: {
                handleButton() {
                    this.clickCounter++;
                    this.message = "The button was clicked";
                },
                hideCover() {
                    this.modalVisible = false;
                    this.coverVisible = false;
                },
                openModal() {
                    this.modalVisible = true;
                },
                closeModal() {
                    this.modalVisible = false;
                }
            },

            computed: {
                twopi(): Number {
                    return this.props.pi * 2;
                },

                myFlag(): Boolean {
                    return this.props.flag.toLowerCase() === "true";
                }
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
        
              <span class="toast" v-if="myFlag">
                The flag is True
              </span>
        
              <span class="toast" v-if="!myFlag">
                The flag is False
              </span>
        
            </div>
        
            
            <div id="floatermain">
              <input id="floatercheckbox" v-model="coverVisible" type="checkbox" role="button" class="floatercheckbox" />
        
              <label id="floaterbutton" for="floatercheckbox" v-show="!modalVisible">
                <i class="fa-solid fa-circle-question"></i><span class="my-float">{{ labels.floater_text }}</span>
              </label>
        
              <div id="floatercover" @click.self="hideCover">
                <div class="floatmenu" v-show="!modalVisible">
                    <div><span @click="openModal">{{ labels.question1 }}</span></div>
                    <div><span @click="openModal">{{ labels.question2 }}</span></div>
                </div>
        
                <div id="modal" :class="modalVisible && activeClass">
                  <div class="modal-content">
                    <div class="header">
                      <h2>Please fill out this form</h2>
                      <span class="close" @click="closeModal">&times;</span>
                    </div>
                    <div class="body">
                      <h2>Modal Body</h2>
                      <p>
                        This is the body of a modal that I made with pure (S)CSS. There is also some VueJS in use. and there is some HTML.
                        The CSS is the magic ingredient here.
                      </p>
                    </div>
                    <div class="footer">
                      The footer
                    </div>
                  </div>
                </div>
        
              </div><!-- #floatercover -->
            </div><!-- #floatermain -->
            `
        };

        const app = createApp(component, { ...mountElement.dataset });
        app.mount("#" + this.mountElementId);
    }
}

new Floater().run();
