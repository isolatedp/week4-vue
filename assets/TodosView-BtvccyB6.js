var H=Object.defineProperty;var Z=(p,r,u)=>r in p?H(p,r,{enumerable:!0,configurable:!0,writable:!0,value:u}):p[r]=u;var w=(p,r,u)=>Z(p,typeof r!="symbol"?r+"":r,u);import{d as G,u as J,a as K,x as Q,r as A,s as x,y as X,o as Y,q as R,A as $,S as f,c as C,b as t,t as E,i as tt,f as M,w as b,v as et,z as S,F as st,C as ot,k as at,B,n as T,D as nt}from"./index-RSR8lP-H.js";const it="/week4-vue/assets/img2-CwWZoW3o.png";class lt{constructor(){w(this,"id",null);w(this,"createTime",0);w(this,"content","");w(this,"status",!1)}}class rt{constructor(){w(this,"content",null)}}const ct={id:"todoListPage",class:"bg-half"},ut=t("h1",null,[t("a",{href:"#"},"ONLINE TODO LIST")],-1),dt={class:"todo_sm"},ht={href:"javascript:void(0)"},ft={class:"conatiner todoListPage vhContainer"},pt={class:"todoList_Content"},vt={class:"inputBox"},_t=t("i",{class:"fa fa-plus"},null,-1),mt=[_t],gt={key:0,class:"todoList_list"},wt={class:"todoList_tab"},kt={class:"todoList_items"},xt={class:"todoList_item"},Ct={class:"todoList_label"},Tt=["onUpdate:modelValue","onClick"],yt=["onClick"],Lt=t("i",{class:"fa fa-times"},null,-1),Rt=[Lt],$t={class:"todoList_statistics"},Bt={key:1,style:{"text-align":"center","padding-top":"4.5rem"}},It=t("p",null,"目前尚無代辦事項",-1),Et=t("img",{class:"d-m-n",src:it,alt:"workImg"},null,-1),Mt=[It,Et],bt=G({__name:"TodosView",setup(p){const r=at(),u=J(),c=K(),{cookies:j}=Q(),m=j.get("userInfo"),V=m?m.nickname:"未知",d=A(new lt);A(new rt);const k=x("all"),_=x([]),g=x([]),z=X(()=>g.value.filter(s=>s.status===!1).length);Y(async()=>{await u.checkout()||r.push("/sign-in"),await L()});const D=async()=>{await u.signOut(),r.push("/sign-in")},y=s=>{k.value=s,s==="all"?g.value=_.value:s==="complete"?g.value=_.value.filter(e=>e.status===!0):s==="uncomplete"&&(g.value=_.value.filter(e=>e.status===!1))},L=async()=>{await u.checkout()||r.push("/sign-in"),c.show();const e=`${B}/todos/`,o={Authorization:m.token};let a,l;try{a=(await R.get(e,{headers:o})).data,c.hide()}catch(i){if(i instanceof $){const n=i.response;a=n==null?void 0:n.data,l=a!=null&&a.message?`取得待辦事項失敗，${a.message}。`:"取得待辦事項失敗，請稍後再試。"}else l="取得待辦事項失敗，請稍後再試。";c.hide(),await f.fire({icon:"error",title:"取得待辦事項失敗",text:l})}a.status&&(_.value=a.data,g.value=_.value)},O=async()=>{if(await u.checkout()||r.push("/sign-in"),!P()||await F()&&!(await f.fire({icon:"info",title:"已有相同待辦事項",text:"是否要新增相同的待辦事項？",showCancelButton:!0,confirmButtonText:"是",cancelButtonText:"否"})).isConfirmed)return;const a=U();c.show();const l=`${B}/todos/`,i={Authorization:m.token};let n,h;try{n=(await R.post(l,a,{headers:i})).data,c.hide()}catch(v){if(v instanceof $){const I=v.response;n=I==null?void 0:I.data,h=n!=null&&n.message?`新增待辦事項失敗，${n.message}。`:"新增待辦事項失敗，請稍後再試。"}else h="新增待辦事項失敗，請稍後再試。";c.hide(),await f.fire({icon:"error",title:"新增待辦事項失敗",text:h});return}n.status&&(N(),await L(),await f.fire({icon:"success",title:"新增待辦事項成功",showConfirmButton:!1,timer:1500}))},F=async()=>{const s=x(!1);let e=`${d.content}`;e=e.replace(/\s+/g,"");const o=_.value.find(a=>a.content===e);return o&&d.id!==o.id&&(s.value=!0),s.value},P=()=>{const s=x(!0);let e="";if(d.content==="")return e="請輸入待辦事項",s.value=!1,f.fire({icon:"error",title:"新增待辦事項失敗",text:e}),s.value;let o=`${d.content}`;return o=o.replace(/\s+/g,""),o===""&&(e="待辦事項不可僅有空白",s.value=!1),s.value||f.fire({icon:"error",title:"新增待辦事項失敗",text:e}),s.value},U=()=>{const s=["id","status","createTime"],e={...d};return Object.keys(e).forEach(o=>{s.includes(o)&&delete e[o]}),e},N=()=>{d.id=null,d.createTime=0,d.content="",d.status=!1},W=async s=>{await u.checkout()||r.push("/sign-in"),c.show();const o=`${B}/todos/${s.id}/toggle`,a={Authorization:m.token};let l,i;try{l=(await R.patch(o,{},{headers:a})).data,c.hide()}catch(n){if(n instanceof $){const h=n.response;l=h==null?void 0:h.data,i=l!=null&&l.message?`切換待辦事項狀態失敗，${l.message}。`:"切換待辦事項狀態失敗，請稍後再試。"}else i="切換待辦事項狀態失敗，請稍後再試。";c.hide(),await f.fire({icon:"error",title:"切換待辦事項狀態失敗",text:i});return}l.status||await f.fire({icon:"error",title:"切換待辦事項狀態失敗",text:i}),await L(),y(k.value)},q=async s=>{if(await u.checkout()||r.push("/sign-in"),!(await f.fire({icon:"warning",title:"刪除待辦事項",text:`確定要刪除「${s.content}」嗎?`,showCancelButton:!0,confirmButtonText:"確定",cancelButtonText:"取消"})).isConfirmed)return;c.show();const a=`${B}/todos/${s.id}`,l={Authorization:m.token};let i,n;try{i=(await R.delete(a,{headers:l})).data,c.hide()}catch(h){if(h instanceof $){const v=h.response;i=v==null?void 0:v.data,n=i!=null&&i.message?`刪除待辦事項失敗，${i.message}。`:"刪除待辦事項失敗，請稍後再試。"}else n="刪除待辦事項失敗，請稍後再試。";c.hide(),await f.fire({icon:"error",title:"刪除待辦事項失敗",text:n});return}i.status||await f.fire({icon:"error",title:"刪除待辦事項失敗",text:n}),await L()};return(s,e)=>(T(),C("div",ct,[t("nav",null,[ut,t("ul",null,[t("li",dt,[t("a",ht,[t("span",null,E(tt(V))+"的代辦",1)])]),t("li",null,[t("a",{href:"javascript:void(0)",onClick:M(D,["prevent"])},"登出")])])]),t("div",ft,[t("div",pt,[t("div",vt,[b(t("input",{type:"text",placeholder:"請輸入待辦事項","onUpdate:modelValue":e[0]||(e[0]=o=>d.content=o)},null,512),[[et,d.content]]),t("a",{href:"javascript:void(0)",onClick:M(O,["prevent"])},mt)]),_.value.length>0?(T(),C("div",gt,[t("ul",wt,[t("li",null,[t("a",{href:"javascript:void(0)",class:S({active:k.value==="all"}),onClick:e[1]||(e[1]=o=>y("all"))},"全部",2)]),t("li",null,[t("a",{href:"javascript:void(0)",class:S({active:k.value==="uncomplete"}),onClick:e[2]||(e[2]=o=>y("uncomplete"))},"待完成",2)]),t("li",null,[t("a",{href:"javascript:void(0)",class:S({active:k.value==="complete"}),onClick:e[3]||(e[3]=o=>y("complete"))},"已完成",2)])]),t("div",kt,[t("ul",xt,[(T(!0),C(st,null,ot(g.value,o=>(T(),C("li",null,[t("label",Ct,[b(t("input",{class:"todoList_input",type:"checkbox",value:"true","onUpdate:modelValue":a=>o.status=a,onClick:a=>W(o)},null,8,Tt),[[nt,o.status]]),t("span",null,E(o.content),1)]),t("a",{href:"javascript:void(0)",onClick:M(a=>q(o),["prevent"])},Rt,8,yt)]))),256))]),t("div",$t,[t("p",null,E(z.value)+" 個待完成項目",1)])])])):(T(),C("div",Bt,Mt))])])]))}});export{bt as default};
