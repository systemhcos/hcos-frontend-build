import{_ as E,c as j,k as p,a as w,F as N,r as R,l as C,w as _,m as q,aM as T,s as A,f as B,t as M,g as F,i as L,p as S,o as O,ah as W,aF as D,e as H}from"./index-BstacYQj.js";import{r as h}from"./requestBridge-C6qhZtPj.js";import{u as I}from"./useApiClient-BvBA-eBP.js";function $(b,y={},t=1e3){return new Promise((o,d)=>{const l=`
      // Remove dangerous globals
      self.fetch = undefined;
      self.importScripts = undefined;
      self.XMLHttpRequest = undefined;
      self.WebSocket = undefined;
      self.indexedDB = undefined;

      const pendingRequests = Object.create(null);

      function sendRequestToMain(request, timeout=5000) {
        return new Promise((resolve, reject) => {
          try {
            const id = Math.random().toString(36).slice(2);
            pendingRequests[id] = { resolve, reject };
            // Ask main thread to perform the request
            self.postMessage({ type: 'request', id, request });

            const t = setTimeout(() => {
              if (pendingRequests[id]) {
                pendingRequests[id].reject(new Error('Request timed out'));
                delete pendingRequests[id];
              }
            }, timeout);

            // wrap resolve/reject to clear timeout
            const originalResolve = resolve;
            const originalReject = reject;
            pendingRequests[id].resolve = (v) => { clearTimeout(t); originalResolve(v); };
            pendingRequests[id].reject = (e) => { clearTimeout(t); originalReject(e); };
          } catch (err) { reject(err); }
        });
      }

      // Listen for responses from main thread
      self.addEventListener('message', (ev) => {
        const msg = ev.data || {};
        if (msg && msg.type === 'response' && msg.id) {
          const h = pendingRequests[msg.id];
          if (!h) return;
          if (msg.error) h.reject(new Error(msg.error)); else h.resolve(msg.response);
          delete pendingRequests[msg.id];
        }
        // 'run' action is handled below on first message
      });

      self.addEventListener('message', async function initialRun(ev) {
        const { action, code, context } = ev.data || {};
        if (action !== 'run') return;
        // remove this listener to avoid duplicate runs
        try { self.removeEventListener('message', initialRun); } catch (e) {}

        const emitted = [];

        const api = {
          data: context.data || {},
          emit: (event, payload) => {
            try { emitted.push({ event: String(event), payload }); } catch (err) { /* ignore */ }
          },
          utils: {
            formatCurrency: (v) => typeof v === 'number' ? v.toFixed(2) : v,
            now: () => Date.now()
          },
          // New: request helper - asks main thread to perform allowed network calls
          request: (req) => sendRequestToMain(req, (req && req.timeout) || 5000)
        };

        try {
          const fn = new Function('api', '"use strict"; return (async function() { ' + code + ' })();');
          const result = await fn(api);
          self.postMessage({ type: 'done', result, events: emitted });
        } catch (err) {
          self.postMessage({ type: 'done', error: String(err), events: emitted });
        }
      });
    `,k=new Blob([l],{type:"application/javascript"}),x=URL.createObjectURL(k),i=new Worker(x);let u=!1;const f=setTimeout(()=>{if(!u){u=!0;try{i.terminate()}catch{}d(new Error("Script execution timed out"))}},t);i.onmessage=async g=>{if(u)return;const s=g.data||{};if(s&&s.type==="request"){try{const n=s.request||{},c=await h.handleRequest(n);i.postMessage({type:"response",id:s.id,response:c})}catch(n){try{i.postMessage({type:"response",id:s.id,error:String(n)})}catch{}}return}if(s&&s.type==="done"){u=!0,clearTimeout(f);try{i.terminate()}catch{}s&&s.error?d(new Error(s.error)):o(s)}if(s&&!s.type){u=!0,clearTimeout(f);try{i.terminate()}catch{}s&&s.error?d(new Error(s.error)):o(s)}},i.onerror=g=>{if(!u){u=!0,clearTimeout(f);try{i.terminate()}catch{}d(g||new Error("Worker error"))}},i.postMessage({action:"run",code:b,context:y})})}async function U(b=[],y={},t=1e3){const o=[];for(const d of b)try{const l=await $(d,y,t);o.push(l)}catch(l){o.push({error:String(l)})}return o}const V={class:"template-renderer"},G={__name:"TemplateRenderer",props:{elements:{type:Array,default:()=>[]},data:{type:Object,default:()=>({})},isChild:{type:Boolean,default:!1},customStyles:{type:Object,default:()=>({})},gridConfig:{type:Object,default:()=>({columns:3})},scripts:{type:Array,default:()=>[]}},emits:["element-click","back-to-products","select-product"],setup(b,{emit:y}){const t=b,o=y,d=j(()=>t.elements.filter(e=>e.type==="section"&&e.id==="detail-view-section"?t.data.selectedProduct:e.type==="section"&&e.id==="product-list-section"?!t.data.selectedProduct:e.id==="empty-state"?!t.data.awaitingApi&&(!t.data.products||t.data.products.length===0):!0)),l=(e,a)=>{if(!a)return;const r=a.split(".");let m=e;for(const v of r){if(m==null)return;m=m[v]}return m},k=(e,a={})=>{if(!e)return"";const r={...t.data||{},...a||{}};return e.replace(/\{\{\s*([^}]+?)\s*\}\}/g,(m,v)=>{const P=l(r,v.trim());return P??""})},x=e=>{const a={};let r=e.style?{...e.style}:{};if(e.type==="input"&&(a.type=e.type||"text",a.placeholder=e.placeholder||"",a.value=t.data[e.id]||""),e.type==="button"&&(a.type="button"),e.type==="grid"||!!e.gridConfig||e.className&&e.className.includes("grid")){const v=e.gridConfig&&e.gridConfig.columns||t.gridConfig&&t.gridConfig.columns||3;r={...r,display:"grid",gridTemplateColumns:`repeat(${v}, 1fr)`}}return e.customStyles&&(r={...r,...e.customStyles}),t.customStyles&&t.customStyles[e.id]&&(r={...r,...t.customStyles[e.id]}),e.attributes&&Object.assign(a,e.attributes),{attrs:a,style:r}};t.scripts&&t.scripts.length>0&&U(t.scripts,{data:t.data},2e3).then(e=>{e.forEach(a=>{a&&a.events&&Array.isArray(a.events)&&a.events.forEach(r=>{r&&r.event&&o(r.event,r.payload)})})}).catch(e=>{console.error("Template scripts error:",e)});const i=e=>{o("element-click",e),e.id==="back-button"&&o("back-to-products")},u=(e,a)=>{o("element-click",e),(e.type==="card"||e.className&&e.className.includes("product"))&&o("select-product",a)},f=()=>{o("back-to-products")},g=e=>{o("select-product",e)},s=(e,a)=>({...e||{},...a||{}}),n=e=>{const{style:a}=x(e);return{...e.style||{},...a||{}}},c=e=>{const{attrs:a}=x(e),r={...a||{}};return r.style&&delete r.style,r};return(e,a)=>(p(),w("div",V,[(p(!0),w(N,null,R(d.value,r=>(p(),w(N,{key:r.id},[r.repeat&&r.children&&r.children.length?(p(!0),w(N,{key:0},R(l(t.data,r.repeat.source)||[],(m,v)=>(p(),C(q(r.tag||"div"),T({key:r.id+"-rep-"+v,class:r.className,style:n(r)},{ref_for:!0},c(r),{onClick:A(()=>u(r,m),["stop"])}),{default:_(()=>[(p(),C(q("TemplateRenderer"),{elements:r.children,data:s(t.data,{[r.repeat.itemName||"item"]:m}),"is-child":!0,"custom-styles":t.customStyles,"grid-config":t.gridConfig,scripts:t.scripts,onElementClick:i,onBackToProducts:f,onSelectProduct:g},null,40,["elements","data","custom-styles","grid-config","scripts"]))]),_:2},1040,["class","style","onClick"]))),128)):(p(),C(q(r.tag||"div"),T({key:1,class:r.className,style:n(r),onClick:()=>i(r)},{ref_for:!0},c(r)),{default:_(()=>[r.children&&r.children.length?(p(),C(q("TemplateRenderer"),{key:0,elements:r.children,data:t.data,"is-child":!0,"custom-styles":t.customStyles,"grid-config":t.gridConfig,scripts:t.scripts,onElementClick:i,onBackToProducts:f,onSelectProduct:g},null,40,["elements","data","custom-styles","grid-config","scripts"])):r.content?(p(),w(N,{key:1},[B(M(k(r.content)),1)],64)):F("",!0)]),_:2},1040,["class","style","onClick"]))],64))),128))]))}},X=E(G,[["__scopeId","data-v-b279230d"]]),Y={class:"template-page"},z={__name:"TemplatePage",setup(b){L(),I();const y=S([]),t=S({products:[],selectedProduct:null,awaitingApi:!1,activeCount:0,pendingCount:0}),o=S({}),d=S({columns:3}),l=S([]);O(async()=>{await k(),await x()});const k=async()=>{try{const s=g();if(y.value=s.structure.elements,s.dataSources&&typeof s.dataSources=="object"){t.value.awaitingApi=!0;try{const n=Object.entries(s.dataSources);for(const[c,e]of n)try{const a=await W(e,{requiresAuth:!1});t.value[c]=Array.isArray(a)?a:a.data||a.items||a.results||a||[]}catch(a){console.error("Failed to fetch data source",e,a),t.value[c]=[]}}finally{t.value.awaitingApi=!1}}o.value=s.customStyles||{},d.value=s.gridConfig||{columns:3},l.value=s.scripts||[];try{if(s.dataSources&&typeof s.dataSources=="object"){const n=Object.values(s.dataSources).map(c=>c&&c.toString?c.toString():"").filter(Boolean);h.setWhitelist(n)}else h.clearWhitelist();try{h.setTemplateId(s.id)}catch(n){console.warn("Unable to set template id on bridge",n)}}catch(n){console.warn("Failed to set request bridge whitelist",n),h.clearWhitelist();try{h.setTemplateId(null)}catch{}}}catch(s){console.error("Failed to load template:",s)}};D(()=>{try{h.clearWhitelist()}catch{}try{h.setTemplateId(null)}catch{}});const x=async()=>{try{t.value.awaitingApi=!0,(!t.value.products||t.value.products.length===0)&&(t.value.products=[{id:1,name:"Basic Hosting",status:"active",price:9.99},{id:2,name:"Premium Hosting",status:"pending",price:19.99}]),t.value.activeCount=t.value.products.filter(s=>s.status==="active").length,t.value.pendingCount=t.value.products.filter(s=>s.status==="pending").length}catch(s){console.error("Failed to load products:",s)}finally{t.value.awaitingApi=!1}},i=s=>{console.log("Element clicked:",s)},u=()=>{t.value.selectedProduct=null},f=s=>{t.value.selectedProduct=s},g=()=>({id:"hosting-services",name:"Hosting Services",dataSources:{products:"api/product-list/",packages:"api/packages/"},structure:{elements:[{id:"main-container",type:"container",tag:"div",className:"space-y-6 ml-4 mr-4 mb-8 relative p-4 bg-white rounded-lg shadow",children:[{id:"stats-section",type:"section",tag:"div",className:"flex gap-4",children:[{id:"active-stat",type:"card",tag:"div",className:"flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg",children:[{id:"active-icon",type:"text",tag:"span",content:"●",className:"text-green-500"},{id:"active-text",type:"text",tag:"span",content:"Active: {{activeCount}}",className:"font-medium"}]},{id:"pending-stat",type:"card",tag:"div",className:"flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg",children:[{id:"pending-icon",type:"text",tag:"span",content:"●",className:"text-yellow-500"},{id:"pending-text",type:"text",tag:"span",content:"Pending: {{pendingCount}}",className:"font-medium"}]}]},{id:"separator",type:"text",tag:"hr",className:"border-t border-gray-200"},{id:"product-list-section",type:"section",tag:"div",className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",gridConfig:{columns:3},children:[{id:"product-card-template",type:"card",tag:"div",className:"bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer",repeat:{source:"products",itemName:"product"},children:[{id:"product-name",type:"heading",tag:"h3",content:"{{product.name}}",className:"text-lg font-semibold text-gray-900 mb-2"},{id:"product-status",type:"text",tag:"span",content:"{{product.status}}",className:"inline-block px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 mb-2"},{id:"product-price",type:"text",tag:"p",content:"${{product.price}}/month",className:"text-gray-600"}]}]},{id:"detail-view-section",type:"section",tag:"div",className:"mt-6",children:[{id:"detail-header",type:"section",tag:"div",className:"flex justify-between items-start mb-4",children:[{id:"back-button",type:"button",tag:"button",content:"Back to Products",className:"px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"}]},{id:"product-detail",type:"card",tag:"div",className:"bg-white border border-gray-200 rounded-lg p-6",children:[{id:"detail-name",type:"heading",tag:"h2",content:"{{selectedProduct.name}}",className:"text-2xl font-bold text-gray-900 mb-4"},{id:"detail-status",type:"text",tag:"span",content:"Status: {{selectedProduct.status}}",className:"inline-block px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800 mb-4"},{id:"detail-price",type:"text",tag:"p",content:"Price: ${{selectedProduct.price}}/month",className:"text-gray-700 mb-4"}]}]},{id:"empty-state",type:"section",tag:"div",className:"text-center py-12",children:[{id:"empty-icon",type:"text",tag:"div",content:"📦",className:"text-6xl mb-4"},{id:"empty-title",type:"heading",tag:"h3",content:"No Services Found",className:"text-xl font-semibold text-gray-900 mb-2"},{id:"empty-description",type:"text",tag:"p",content:"You don't have any hosting services yet.",className:"text-gray-600"}]}]}]}});return(s,n)=>(p(),w("div",Y,[H(X,{elements:y.value,data:t.value,"custom-styles":o.value,"grid-config":d.value,scripts:l.value,onElementClick:i,onBackToProducts:u,onSelectProduct:f},null,8,["elements","data","custom-styles","grid-config","scripts"])]))}},Z=E(z,[["__scopeId","data-v-5a2b49b2"]]);export{Z as default};
