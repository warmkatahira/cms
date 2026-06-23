const l=document.getElementById("board");document.getElementById("tray");const c=parseInt(l.dataset.whiteboardId),Y=parseInt(l.dataset.canvasW),D=parseInt(l.dataset.canvasH),d=document.querySelector('meta[name="csrf-token"]').content,O=[{bg:"#E6F1FB",border:"#378ADD",text:"#0C447C"},{bg:"#EAF3DE",border:"#639922",text:"#27500A"},{bg:"#FAEEDA",border:"#BA7517",text:"#633806"},{bg:"#FBEAF0",border:"#D4537E",text:"#72243E"},{bg:"#E1F5EE",border:"#1D9E75",text:"#085041"},{bg:"#EEEDFE",border:"#7F77DD",text:"#3C3489"},{bg:"#FAECE7",border:"#D85A30",text:"#711B13"},{bg:"#FEF9E7",border:"#D4AC0D",text:"#7D6608"},{bg:"#F2F3F4",border:"#717D7E",text:"#2C3E50"},{bg:"#FDEDEC",border:"#C0392B",text:"#7B241C"}],ae=[{border:"#378ADD",bg:"rgba(56,138,221,0.06)",text:"#0C447C"},{border:"#639922",bg:"rgba(99,153,34,0.06)",text:"#27500A"},{border:"#D4537E",bg:"rgba(212,83,126,0.06)",text:"#72243E"},{border:"#BA7517",bg:"rgba(186,117,23,0.06)",text:"#633806"},{border:"#7F77DD",bg:"rgba(127,119,221,0.06)",text:"#3C3489"},{border:"#1D9E75",bg:"rgba(29,158,117,0.06)",text:"#085041"},{border:"#D85A30",bg:"rgba(216,90,48,0.06)",text:"#711B13"},{border:"#D4AC0D",bg:"rgba(212,172,13,0.06)",text:"#7D6608"},{border:"#717D7E",bg:"rgba(113,125,126,0.06)",text:"#2C3E50"},{border:"#C0392B",bg:"rgba(192,57,43,0.06)",text:"#7B241C"}],V=["#374151","#ffffff","#dc2626","#ea580c","#ca8a04","#16a34a","#2563eb","#7c3aed","#ec4899","#000000","#6b7280","#b91c1c","#92400e","#854d0e","#065f46","#1e40af","#5b21b6","#9d174d","#0891b2","#fca5a5","#fdba74","#fde047","#86efac","#93c5fd","#c4b5fd","#f9a8d4","#67e8f9","#9ca3af","#e5e7eb"];let f=0,H=null;function T(e){f=e}function Z(e){H=e}let S=null,k=null,ke=0,Ce=0,Q=null,ye=0,fe=0;function se(e){e.addEventListener("mousedown",i=>tt(i,e)),e.addEventListener("touchstart",i=>tt(i,e),{passive:!1}),e.addEventListener("mouseenter",()=>{const i=e.querySelector(".chip-edit-btn");i&&(i.style.display="flex");const a=e.querySelector(".chip-copy-btn");a&&(a.style.display="flex");const s=e.querySelector(".chip-resize-handle");s&&(s.style.display="block")}),e.addEventListener("mouseleave",()=>{const i=e.querySelector(".chip-edit-btn");i&&(i.style.display="none");const a=e.querySelector(".chip-copy-btn");a&&(a.style.display="none");const s=e.querySelector(".chip-resize-handle");s&&(s.style.display="none")});const t=e.querySelector(".chip-edit-btn");t&&(t.addEventListener("mousedown",i=>i.stopPropagation()),t.addEventListener("click",i=>{i.stopPropagation(),To(i,e)}));const o=e.querySelector(".chip-copy-btn");o&&(o.addEventListener("mousedown",i=>i.stopPropagation()),o.addEventListener("click",i=>{i.stopPropagation(),qo(e)}));const n=e.querySelector(".chip-resize-handle");n&&(n.addEventListener("mousedown",i=>ot(i,e)),n.addEventListener("touchstart",i=>ot(i,e),{passive:!1}))}function tt(e,t){S&&(S.style.opacity="1",S=null),k&&(k.remove(),k=null);const o=e.touches?e.touches[0].clientX:e.clientX,n=e.touches?e.touches[0].clientY:e.clientY;Q=t,ye=o,fe=n,document.addEventListener("mousemove",Te),document.addEventListener("mouseup",Ie)}function Te(e){const t=e.clientX-ye,o=e.clientY-fe;(Math.abs(t)>4||Math.abs(o)>4)&&(document.removeEventListener("mousemove",Te),document.removeEventListener("mouseup",Ie),Co(Q,ye,fe),Q=null)}function Ie(){document.removeEventListener("mousemove",Te),document.removeEventListener("mouseup",Ie),Q=null}function Co(e,t,o){S=e;const n=e.getBoundingClientRect();ke=t-n.left,Ce=o-n.top,k=e.cloneNode(!0),k.style.cssText=`
        position:fixed;pointer-events:none;z-index:9999;opacity:0.85;
        left:${n.left}px;top:${n.top}px;
        transform:rotate(2deg) scale(1.05);
    `,document.body.appendChild(k),e.style.opacity="0.3",document.addEventListener("mousemove",ht),document.addEventListener("mouseup",mt),document.addEventListener("touchmove",yt,{passive:!1}),document.addEventListener("touchend",xt)}function ht(e){ft(e.clientX,e.clientY)}function yt(e){e.preventDefault(),ft(e.touches[0].clientX,e.touches[0].clientY)}function ft(e,t){k.style.left=e-ke+"px",k.style.top=t-Ce+"px"}function mt(e){bt(e.clientX,e.clientY)}function xt(e){bt(e.changedTouches[0].clientX,e.changedTouches[0].clientY)}function bt(e,t){document.removeEventListener("mousemove",ht),document.removeEventListener("mouseup",mt),document.removeEventListener("touchmove",yt),document.removeEventListener("touchend",xt),k.remove(),k=null;const o=l.getBoundingClientRect(),n=S.dataset.id;let i=e-o.left+l.scrollLeft-ke,a=t-o.top+l.scrollTop-Ce;i=Math.max(0,Math.min(i,Y-80)),a=Math.max(0,Math.min(a,D-50)),qe(n,i,a),S.style.position="absolute",S.style.left=i+"px",S.style.top=a+"px",document.getElementById("board-canvas").appendChild(S),S.style.opacity="1",S=null}function qe(e,t,o){const n=document.querySelector(`.magnet[data-id="${e}"]`),i=n?n.querySelector(".staff-chip-wrap > div"):null;i&&(i.offsetWidth,i.offsetHeight),fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_type:"staff",item_id:parseInt(e),pos_x:t,pos_y:o,meta:{staff_name:(n==null?void 0:n.dataset.name)??"",role_name:(n==null?void 0:n.dataset.role)??"",color:parseInt((n==null?void 0:n.dataset.color)??0),shape:(n==null?void 0:n.dataset.shape)??"rect",width:i?i.offsetWidth:90,height:i?i.offsetHeight:40}})})}let b=null,gt=0,vt=0,Et=0,wt=0;function ot(e,t){e.stopPropagation(),e.preventDefault(),b=t,gt=e.touches?e.touches[0].clientX:e.clientX,vt=e.touches?e.touches[0].clientY:e.clientY;const o=t.querySelector(".staff-chip-wrap > div");Et=o?o.offsetWidth:90,wt=o?o.offsetHeight:40,document.addEventListener("mousemove",St),document.addEventListener("mouseup",_t),document.addEventListener("touchmove",zt,{passive:!1}),document.addEventListener("touchend",kt)}function St(e){Lt(e.clientX,e.clientY)}function zt(e){e.preventDefault(),Lt(e.touches[0].clientX,e.touches[0].clientY)}function Lt(e,t){if(!b)return;const o=b.querySelector(".staff-chip-wrap > div");o&&(o.style.width=Math.max(50,Et+(e-gt))+"px",o.style.height=Math.max(50,wt+(t-vt))+"px")}function _t(){Ct()}function kt(){Ct()}function Ct(){if(document.removeEventListener("mousemove",St),document.removeEventListener("mouseup",_t),document.removeEventListener("touchmove",zt),document.removeEventListener("touchend",kt),!b)return;const e=b.querySelector(".staff-chip-wrap > div"),t=b.dataset.id;fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_type:"staff",item_id:parseInt(t),pos_x:parseFloat(b.style.left)||0,pos_y:parseFloat(b.style.top)||0,meta:{staff_name:b.dataset.name??"",role_name:b.dataset.role??"",color:parseInt(b.dataset.color??0),shape:b.dataset.shape??"rect",width:e?e.offsetWidth:90,height:e?e.offsetHeight:40}})}),b=null}let $e=null,L=null,P=0,Tt="M",B="rect";const y=document.createElement("div");y.id="staff-edit-modal";y.style.cssText=`
    display:none;position:fixed;inset:0;z-index:99999;
    background:rgba(0,0,0,0.4);
    align-items:center;justify-content:center;
`;y.innerHTML=`
    <div style="background:white;border-radius:12px;padding:24px;width:340px;">
        <p style="font-size:15px;font-weight:500;margin-bottom:16px;">スタッフを編集</p>
        <div style="display:flex;gap:0;margin-bottom:16px;border-bottom:2px solid #e5e7eb;">
            <div class="modal-tab active-tab" data-tab="basic"
                 style="padding:6px 16px;font-size:13px;cursor:pointer;font-weight:500;
                        border-bottom:2px solid #374151;margin-bottom:-2px;color:#374151;">
                基本情報
            </div>
            <div class="modal-tab" data-tab="appearance"
                 style="padding:6px 16px;font-size:13px;cursor:pointer;font-weight:500;
                        border-bottom:2px solid transparent;margin-bottom:-2px;color:#9ca3af;">
                見た目
            </div>
        </div>
        <div id="tab-basic">
            <div style="margin-bottom:12px;">
                <label style="font-size:12px;color:#6b7280;display:block;margin-bottom:4px;">氏名</label>
                <input id="edit-name" type="text" autocomplete="off"
                       style="width:100%;font-size:14px;border:1px solid #d1d5db;border-radius:6px;padding:6px 10px;">
            </div>
            <div style="margin-bottom:12px;">
                <label style="font-size:12px;color:#6b7280;display:block;margin-bottom:4px;">役割</label>
                <input id="edit-role" type="text" autocomplete="off"
                       style="width:100%;font-size:14px;border:1px solid #d1d5db;border-radius:6px;padding:6px 10px;">
            </div>
        </div>
        <div id="tab-appearance" style="display:none;">
            <div style="margin-bottom:16px;">
                <label style="font-size:12px;color:#6b7280;display:block;margin-bottom:8px;">色</label>
                <div style="display:flex;gap:8px;">
                    ${O.map((e,t)=>`
                        <div class="edit-color-chip" data-color="${t}"
                             style="width:24px;height:24px;border-radius:50%;cursor:pointer;
                                    background:${e.bg};border:2px solid ${e.border};">
                        </div>
                    `).join("")}
                </div>
            </div>
            <div style="margin-bottom:16px;">
                <label style="font-size:12px;color:#6b7280;display:block;margin-bottom:8px;">形</label>
                <div style="display:flex;gap:8px;">
                    <div class="edit-shape-chip" data-shape="rect"
                         style="width:40px;height:40px;cursor:pointer;border:1.5px solid #d1d5db;
                                border-radius:6px;background:white;display:flex;align-items:center;justify-content:center;">
                        <div style="width:24px;height:24px;border-radius:4px;background:#d1d5db;"></div>
                    </div>
                    <div class="edit-shape-chip" data-shape="circle"
                         style="width:40px;height:40px;cursor:pointer;border:1.5px solid #d1d5db;
                                border-radius:6px;background:white;display:flex;align-items:center;justify-content:center;">
                        <div style="width:24px;height:24px;border-radius:50%;background:#d1d5db;"></div>
                    </div>
                    <div class="edit-shape-chip" data-shape="sharp"
                         style="width:40px;height:40px;cursor:pointer;border:1.5px solid #d1d5db;
                                border-radius:6px;background:white;display:flex;align-items:center;justify-content:center;">
                        <div style="width:24px;height:24px;border-radius:0;background:#d1d5db;"></div>
                    </div>
                    <div class="edit-shape-chip" data-shape="rounded_bottom"
                        style="width:40px;height:40px;cursor:pointer;border:1.5px solid #d1d5db;
                                border-radius:6px;background:white;display:flex;align-items:center;justify-content:center;">
                        <div style="width:24px;height:24px;border-radius:0 0 50% 50%;background:#d1d5db;"></div>
                    </div>
                    <div class="edit-shape-chip" data-shape="tab"
                         style="width:40px;height:40px;cursor:pointer;border:1.5px solid #d1d5db;
                                border-radius:6px;background:white;display:flex;align-items:center;justify-content:center;">
                        <div style="width:24px;height:24px;border-radius:0 0 4px 4px;background:#d1d5db;
                                    border-top:3px solid #9ca3af;"></div>
                    </div>
                </div>
            </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">
            <button id="edit-delete"
                    style="font-size:13px;padding:6px 16px;border:1px solid #fca5a5;
                           border-radius:6px;cursor:pointer;background:white;color:#dc2626;">
                削除
            </button>
            <div style="display:flex;gap:8px;">
                <button id="edit-cancel"
                        style="font-size:13px;padding:6px 16px;border:1px solid #d1d5db;
                               border-radius:6px;cursor:pointer;background:white;">
                    キャンセル
                </button>
                <button id="edit-save"
                        style="font-size:13px;padding:6px 16px;border:none;
                               border-radius:6px;cursor:pointer;background:#374151;color:white;">
                    保存
                </button>
            </div>
        </div>
    </div>
`;document.body.appendChild(y);y.querySelectorAll(".modal-tab").forEach(e=>{e.addEventListener("click",()=>{y.querySelectorAll(".modal-tab").forEach(t=>{t.style.borderBottomColor="transparent",t.style.color="#9ca3af"}),e.style.borderBottomColor="#374151",e.style.color="#374151",document.getElementById("tab-basic").style.display=e.dataset.tab==="basic"?"block":"none",document.getElementById("tab-appearance").style.display=e.dataset.tab==="appearance"?"block":"none"})});y.querySelectorAll(".edit-color-chip").forEach(e=>{e.addEventListener("click",()=>{P=parseInt(e.dataset.color),y.querySelectorAll(".edit-color-chip").forEach(t=>{t.style.transform="scale(1)",t.style.outline="none"}),e.style.transform="scale(1.2)",e.style.outline="2px solid #374151",e.style.outlineOffset="2px"})});y.querySelectorAll(".edit-shape-chip").forEach(e=>{e.addEventListener("click",()=>{B=e.dataset.shape,y.querySelectorAll(".edit-shape-chip").forEach(t=>{t.style.borderColor="#d1d5db",t.style.background="white"}),e.style.borderColor="#374151",e.style.background="#f3f4f6"})});document.getElementById("edit-cancel").addEventListener("click",()=>{y.style.display="none"});function To(e,t){e.preventDefault(),$e=t.dataset.id,L=t;const o=y.querySelector('.modal-tab[data-tab="appearance"]');o&&(o.style.display="block"),document.getElementById("edit-name").value=t.dataset.name??"",document.getElementById("edit-role").value=t.dataset.role??"",P=parseInt(t.dataset.color??0)||0,Tt=t.dataset.size??"M",B=t.dataset.shape??"rect",y.querySelectorAll(".edit-color-chip").forEach(i=>{i.style.transform="scale(1)",i.style.outline="none"});const n=y.querySelector(`.edit-color-chip[data-color="${P}"]`);n&&(n.style.transform="scale(1.2)",n.style.outline="2px solid #374151",n.style.outlineOffset="2px"),y.querySelectorAll(".edit-shape-chip").forEach(i=>{const a=i.dataset.shape===B;i.style.borderColor=a?"#374151":"#d1d5db",i.style.background=a?"#f3f4f6":"white"}),document.getElementById("tab-basic").style.display="block",document.getElementById("tab-appearance").style.display="none",y.querySelectorAll(".modal-tab").forEach(i=>{const a=i.dataset.tab==="basic";i.style.borderBottomColor=a?"#374151":"transparent",i.style.color=a?"#374151":"#9ca3af"}),y.style.display="flex"}document.getElementById("edit-save").addEventListener("click",()=>{const e=document.getElementById("edit-name").value.trim(),t=document.getElementById("edit-role").value.trim();if(!e)return;const o=L.querySelector(".staff-chip-wrap"),n=o.querySelector("div");fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_type:"staff",item_id:parseInt($e),pos_x:parseFloat(L.style.left)||0,pos_y:parseFloat(L.style.top)||0,meta:{staff_name:e,role_name:t,color:P,shape:B,width:n?n.offsetWidth:90,height:n?n.offsetHeight:40}})}).then(i=>i.json()).then(()=>{const i=O[P],a={rect:"border-radius:8px;clip-path:none;",circle:"border-radius:50%;clip-path:none;",sharp:"border-radius:0;clip-path:none;",rounded_bottom:"border-radius:0 0 50% 50%;clip-path:none;",tab:"border-radius:0 0 8px 8px;clip-path:none;"};n.style.cssText=`
            background:${i.bg};
            border:2px solid ${i.border};
            border-top:${B==="tab"?"4px":"2px"} solid ${i.border};
            width:${n.style.width||n.offsetWidth+"px"};
            height:${n.style.height||n.offsetHeight+"px"};
            padding:6px;text-align:center;
            ${a[B]??a.rect}
        `,L.dataset.shape=B,L.dataset.size=Tt,L.dataset.color=P,L.dataset.name=e,L.dataset.role=t;const s=o.querySelector('[data-field="name"]'),p=o.querySelector('[data-field="role"]');s&&(s.textContent=e,s.style.color=i.text),p&&(p.textContent=t,p.style.color=i.text),y.style.display="none"})});document.getElementById("edit-delete").addEventListener("click",()=>{confirm("このスタッフを削除しますか？")&&fetch("/board/staff/"+$e,{method:"DELETE",headers:{"X-CSRF-TOKEN":d}}).then(e=>e.json()).then(()=>{L.remove(),y.style.display="none"})});function Io(){const e=document.getElementById("newName").value.trim(),t=document.getElementById("newRole").value.trim();e&&fetch("/board/staff",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,staff_name:e,role_name:t})}).then(o=>o.json()).then(o=>{var s,p,u,h,E,I,w;const n=o.item,i=O[(((s=n.meta)==null?void 0:s.color)??0)%O.length],a=document.createElement("div");a.className="magnet absolute cursor-grab select-none",a.dataset.id=n.whiteboard_item_id,a.dataset.color=((p=n.meta)==null?void 0:p.color)??0,a.dataset.name=((u=n.meta)==null?void 0:u.staff_name)??"",a.dataset.role=((h=n.meta)==null?void 0:h.role_name)??"",a.dataset.shape=((E=n.meta)==null?void 0:E.shape)??"rect",a.style.left="40px",a.style.top="40px",a.innerHTML=It(((I=n.meta)==null?void 0:I.staff_name)??"",((w=n.meta)==null?void 0:w.role_name)??"",i),se(a),document.getElementById("board-canvas").appendChild(a),qe(n.whiteboard_item_id,40,40),document.getElementById("newName").value="",document.getElementById("newRole").value=""})}function It(e,t,o){return`
        <div class="staff-chip-wrap" style="position:relative;display:inline-block;">
            <div style="width:90px;padding:6px;border-radius:8px;text-align:center;
                        border:2px solid ${o.border};background:${o.bg};">
                <div data-field="name" style="font-size:12px;font-weight:500;color:${o.text};">${e}</div>
                <div data-field="role" style="font-size:10px;color:${o.text};opacity:.7;">${t}</div>
            </div>
            <div class="chip-edit-btn" style="display:none;position:absolute;top:-7px;right:-7px;
                width:18px;height:18px;border-radius:50%;background:#374151;color:white;font-size:10px;
                align-items:center;justify-content:center;cursor:pointer;z-index:10;">✏</div>
            <div class="chip-copy-btn" style="display:none;position:absolute;top:-7px;right:14px;
                width:18px;height:18px;border-radius:50%;background:#374151;color:white;font-size:10px;
                align-items:center;justify-content:center;cursor:pointer;z-index:10;">📋</div>
            <div class="chip-resize-handle" style="display:none;position:absolute;bottom:-4px;right:-4px;
                width:10px;height:10px;border-radius:2px;background:#374151;cursor:se-resize;z-index:10;"></div>
        </div>`}function qo(e){fetch("/board/staff",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,staff_name:e.dataset.name,role_name:e.dataset.role,color:parseInt(e.dataset.color)||0})}).then(t=>t.json()).then(t=>{var s,p,u;const o=t.item,n=document.createElement("div");n.className="magnet absolute cursor-grab select-none",n.dataset.id=o.whiteboard_item_id,n.dataset.color=((s=o.meta)==null?void 0:s.color)??0,n.dataset.name=((p=o.meta)==null?void 0:p.staff_name)??"",n.dataset.role=((u=o.meta)==null?void 0:u.role_name)??"",n.dataset.size=e.dataset.size??"M",n.dataset.shape=e.dataset.shape??"rect",n.innerHTML=e.innerHTML,n.querySelectorAll(".chip-edit-btn, .chip-copy-btn").forEach(h=>h.style.display="none"),n.querySelectorAll(".chip-resize-handle").forEach(h=>h.style.display="none"),se(n),H!==e&&(T(0),Z(e)),T(f+20);const i=(parseFloat(e.style.left)||0)+f,a=(parseFloat(e.style.top)||0)+f;n.style.left=i+"px",n.style.top=a+"px",document.getElementById("board-canvas").appendChild(n),qe(o.whiteboard_item_id,i,a)})}function $o(e){setTimeout(()=>{var n,i,a,s,p,u,h;if(document.querySelector(`.magnet[data-id="${e.whiteboard_item_id}"]`))return;const t=O[(((n=e.meta)==null?void 0:n.color)??0)%O.length],o=document.createElement("div");o.className="magnet absolute cursor-grab select-none",o.dataset.id=e.whiteboard_item_id,o.dataset.color=((i=e.meta)==null?void 0:i.color)??0,o.dataset.name=((a=e.meta)==null?void 0:a.staff_name)??"",o.dataset.role=((s=e.meta)==null?void 0:s.role_name)??"",o.dataset.shape=((p=e.meta)==null?void 0:p.shape)??"rect",o.style.left="40px",o.style.top="40px",o.innerHTML=It(((u=e.meta)==null?void 0:u.staff_name)??"",((h=e.meta)==null?void 0:h.role_name)??"",t),se(o),document.getElementById("board-canvas").appendChild(o)},100)}function Mo(e){const t=document.querySelector(`.magnet[data-id="${e.staffId}"]`);t&&t.remove()}function Oo(e){var o,n,i,a,s;const t=document.querySelector(`.magnet[data-id="${e.itemId}"]`);if(t){if(t.style.position="absolute",t.style.left=e.posX+"px",t.style.top=e.posY+"px",(o=e.meta)!=null&&o.width&&(t.querySelector(".staff-chip-wrap > div").style.width=e.meta.width+"px"),(n=e.meta)!=null&&n.height&&(t.querySelector(".staff-chip-wrap > div").style.height=e.meta.height+"px"),(i=e.meta)!=null&&i.staff_name||((a=e.meta)==null?void 0:a.color)!==void 0||(s=e.meta)!=null&&s.shape){const p=O[(e.meta.color??0)%O.length],u=t.querySelector(".staff-chip-wrap"),h=u==null?void 0:u.querySelector("div"),E={rect:"border-radius:8px;",circle:"border-radius:50%;",sharp:"border-radius:0;",rounded_bottom:"border-radius:0 0 50% 50%;",tab:"border-radius:0 0 8px 8px;"};h&&(h.style.cssText=`
                background:${p.bg};border:2px solid ${p.border};
                width:${h.style.width||h.offsetWidth+"px"};
                height:${h.style.height||h.offsetHeight+"px"};
                padding:6px;text-align:center;
                ${E[e.meta.shape]??E.rect}
            `),t.dataset.name=e.meta.staff_name??"",t.dataset.role=e.meta.role_name??"",t.dataset.color=e.meta.color??0,t.dataset.shape=e.meta.shape??"rect";const I=u==null?void 0:u.querySelector('[data-field="name"]'),w=u==null?void 0:u.querySelector('[data-field="role"]');I&&(I.textContent=e.meta.staff_name??"",I.style.color=p.text),w&&(w.textContent=e.meta.role_name??"",w.style.color=p.text)}document.getElementById("board-canvas").appendChild(t)}}let N=null,C=null,Me=0,Oe=0,ee=null,me=0,xe=0;function re(e){e.addEventListener("mousedown",i=>nt(i,e)),e.addEventListener("touchstart",i=>nt(i,e),{passive:!1}),e.addEventListener("mouseenter",()=>{const i=e.querySelector(".zone-edit-btn");i&&(i.style.display="flex");const a=e.querySelector(".zone-copy-btn");a&&(a.style.display="flex");const s=e.querySelector(".zone-resize-handle");s&&(s.style.display="block")}),e.addEventListener("mouseleave",()=>{const i=e.querySelector(".zone-edit-btn");i&&(i.style.display="none");const a=e.querySelector(".zone-copy-btn");a&&(a.style.display="none");const s=e.querySelector(".zone-resize-handle");s&&(s.style.display="none")});const t=e.querySelector(".zone-edit-btn");t&&(t.addEventListener("mousedown",i=>i.stopPropagation()),t.addEventListener("click",i=>{i.stopPropagation(),Ro(e)}));const o=e.querySelector(".zone-copy-btn");o&&(o.addEventListener("mousedown",i=>i.stopPropagation()),o.addEventListener("click",i=>{i.stopPropagation(),Ao(e)}));const n=e.querySelector(".zone-resize-handle");n&&(n.addEventListener("mousedown",i=>it(i,e)),n.addEventListener("touchstart",i=>it(i,e),{passive:!1}))}function nt(e,t){if(e.target.classList.contains("zone-edit-btn")||e.target.classList.contains("zone-copy-btn"))return;N&&(N.style.opacity="1",N=null),C&&(C.remove(),C=null);const o=e.touches?e.touches[0].clientX:e.clientX,n=e.touches?e.touches[0].clientY:e.clientY;ee=t,me=o,xe=n,document.addEventListener("mousemove",Be),document.addEventListener("mouseup",Re)}function Be(e){const t=e.clientX-me,o=e.clientY-xe;(Math.abs(t)>4||Math.abs(o)>4)&&(document.removeEventListener("mousemove",Be),document.removeEventListener("mouseup",Re),Bo(ee,me,xe),ee=null)}function Re(){document.removeEventListener("mousemove",Be),document.removeEventListener("mouseup",Re),ee=null}function Bo(e,t,o){N=e;const n=e.getBoundingClientRect();Me=t-n.left,Oe=o-n.top,C=e.cloneNode(!0),C.style.cssText=`
        position:fixed;pointer-events:none;z-index:9998;opacity:0.7;
        left:${n.left}px;top:${n.top}px;
        width:${n.width}px;height:${n.height}px;
    `,document.body.appendChild(C),e.style.opacity="0.3",document.addEventListener("mousemove",qt),document.addEventListener("mouseup",Ot),document.addEventListener("touchmove",$t,{passive:!1}),document.addEventListener("touchend",Bt)}function qt(e){Mt(e.clientX,e.clientY)}function $t(e){e.preventDefault(),Mt(e.touches[0].clientX,e.touches[0].clientY)}function Mt(e,t){C.style.left=e-Me+"px",C.style.top=t-Oe+"px"}function Ot(e){Rt(e.clientX,e.clientY)}function Bt(e){Rt(e.changedTouches[0].clientX,e.changedTouches[0].clientY)}function Rt(e,t){document.removeEventListener("mousemove",qt),document.removeEventListener("mouseup",Ot),document.removeEventListener("touchmove",$t),document.removeEventListener("touchend",Bt),C.remove(),C=null;const o=l.getBoundingClientRect(),n=N,i=n.dataset.zoneId;let a=e-o.left+l.scrollLeft-Me,s=t-o.top+l.scrollTop-Oe;a=Math.max(0,Math.min(a,Y-n.offsetWidth)),s=Math.max(0,Math.min(s,D-n.offsetHeight)),n.style.left=a+"px",n.style.top=s+"px",n.style.opacity="1",N=null,fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_type:"zone",item_id:parseInt(i),pos_x:a,pos_y:s,meta:{color_index:parseInt(n.dataset.colorIndex??0),label:n.dataset.label??"",width:n.offsetWidth,height:n.offsetHeight}})})}let g=null,Xt=0,Ft=0,At=0,Pt=0;function it(e,t){e.stopPropagation(),e.preventDefault(),g=t,Xt=e.touches?e.touches[0].clientX:e.clientX,Ft=e.touches?e.touches[0].clientY:e.clientY,At=t.offsetWidth,Pt=t.offsetHeight,document.addEventListener("mousemove",Nt),document.addEventListener("mouseup",Dt),document.addEventListener("touchmove",jt,{passive:!1}),document.addEventListener("touchend",Ht)}function Nt(e){Yt(e.clientX,e.clientY)}function jt(e){e.preventDefault(),Yt(e.touches[0].clientX,e.touches[0].clientY)}function Yt(e,t){g&&(g.style.width=Math.max(100,At+(e-Xt))+"px",g.style.height=Math.max(80,Pt+(t-Ft))+"px")}function Dt(e){Kt()}function Ht(e){Kt()}function Kt(){document.removeEventListener("mousemove",Nt),document.removeEventListener("mouseup",Dt),document.removeEventListener("touchmove",jt),document.removeEventListener("touchend",Ht),g&&(fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_type:"zone",item_id:parseInt(g.dataset.zoneId),pos_x:parseFloat(g.style.left)||0,pos_y:parseFloat(g.style.top)||0,meta:{color_index:parseInt(g.dataset.colorIndex??0),label:g.dataset.label??"",width:g.offsetWidth,height:g.offsetHeight}})}),g=null)}let m=null,j=0;const z=document.createElement("div");z.id="zone-edit-modal";z.style.cssText=`
    display:none;position:fixed;inset:0;z-index:99999;
    background:rgba(0,0,0,0.4);
    align-items:center;justify-content:center;
`;z.innerHTML=`
    <div style="background:white;border-radius:12px;padding:24px;width:400px;">
        <p style="font-size:15px;font-weight:500;margin-bottom:16px;">グループを編集</p>
        <div style="margin-bottom:16px;">
            <label style="font-size:12px;color:#6b7280;display:block;margin-bottom:4px;">名称</label>
            <input id="zone-edit-label" type="text" autocomplete="off"
                   style="width:100%;font-size:14px;border:1px solid #d1d5db;border-radius:6px;padding:6px 10px;">
        </div>
        <div style="margin-bottom:20px;">
            <label style="font-size:12px;color:#6b7280;display:block;margin-bottom:8px;">色</label>
            <div style="display:flex;flex-wrap:wrap;gap:8px;">
                ${ae.map((e,t)=>`
                    <div class="zone-color-chip" data-color-index="${t}"
                         style="width:28px;height:28px;min-width:28px;min-height:28px;border-radius:50%;cursor:pointer;
                                background:${e.border};border:2px solid ${e.border};">
                    </div>
                `).join("")}
            </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;">
            <button id="zone-edit-delete"
                    style="font-size:13px;padding:6px 16px;border:1px solid #fca5a5;
                           border-radius:6px;cursor:pointer;background:white;color:#dc2626;">
                削除
            </button>
            <div style="display:flex;gap:8px;">
                <button id="zone-edit-cancel"
                        style="font-size:13px;padding:6px 16px;border:1px solid #d1d5db;
                               border-radius:6px;cursor:pointer;background:white;">
                    キャンセル
                </button>
                <button id="zone-edit-save"
                        style="font-size:13px;padding:6px 16px;border:none;
                               border-radius:6px;cursor:pointer;background:#374151;color:white;">
                    保存
                </button>
            </div>
        </div>
    </div>
`;document.body.appendChild(z);z.querySelectorAll(".zone-color-chip").forEach(e=>{e.addEventListener("click",()=>{j=parseInt(e.dataset.colorIndex),z.querySelectorAll(".zone-color-chip").forEach(t=>{t.style.outline="none",t.style.transform="scale(1)"}),e.style.outline="2px solid #374151",e.style.outlineOffset="2px",e.style.transform="scale(1.2)"})});document.getElementById("zone-edit-cancel").addEventListener("click",()=>{z.style.display="none"});document.getElementById("zone-edit-save").addEventListener("click",()=>{const e=document.getElementById("zone-edit-label").value.trim();if(!e)return;const t=ae[j];fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_type:"zone",item_id:parseInt(m.dataset.zoneId),pos_x:parseFloat(m.style.left)||0,pos_y:parseFloat(m.style.top)||0,meta:{color_index:j,label:e,width:parseFloat(m.style.width)||m.offsetWidth,height:parseFloat(m.style.height)||m.offsetHeight}})}),m.style.borderColor=t.border,m.style.background=t.bg,m.dataset.colorIndex=j,m.dataset.label=e;const o=m.querySelector(".zone-label-text");o&&(o.textContent=e,o.style.color=t.text),z.style.display="none"});document.getElementById("zone-edit-delete").addEventListener("click",()=>{confirm("このグループを削除しますか？")&&fetch("/board/zone/"+m.dataset.zoneId,{method:"DELETE",headers:{"X-CSRF-TOKEN":d}}).then(e=>e.json()).then(()=>{m.remove(),z.style.display="none"})});function Ro(e){m=e,j=parseInt(e.dataset.colorIndex??0),document.getElementById("zone-edit-label").value=e.dataset.label??"",z.querySelectorAll(".zone-color-chip").forEach(t=>{const o=parseInt(t.dataset.colorIndex)===j;t.style.outline=o?"2px solid #374151":"none",t.style.outlineOffset="2px",t.style.transform=o?"scale(1.2)":"scale(1)"}),z.style.display="flex"}function Xo(){const e=document.getElementById("newZoneLabel").value.trim();e&&fetch("/board/zone",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,label:e,color_index:0})}).then(t=>t.json()).then(t=>{const o=t.item,n=Xe(o);document.getElementById("board-canvas").appendChild(n),re(n),document.getElementById("newZoneLabel").value=""})}function Xe(e){const t=e.meta??{},o=ae[t.color_index??0],n=document.createElement("div");return n.className="zone magnet-zone cursor-grab select-none absolute border-2 rounded-xl",n.dataset.zoneId=e.whiteboard_item_id,n.dataset.colorIndex=t.color_index??0,n.dataset.label=t.label??"",n.style.cssText=`
        left:${e.pos_x??40}px;top:${e.pos_y??40}px;
        width:${t.width??180}px;height:${t.height??280}px;
        border-color:${o.border};background:${o.bg};
    `,n.innerHTML=Fo(t.label??"",o),n}function Fo(e,t){return`
        <span class="zone-label-text absolute -top-3 left-2 text-xs font-medium px-1 rounded pointer-events-none select-none"
              style="color:${t.text};background:#f7f6f0;">${e}</span>
        <div class="zone-edit-btn" style="display:none;position:absolute;top:-7px;right:-7px;
            width:18px;height:18px;border-radius:50%;background:#374151;color:white;font-size:10px;
            align-items:center;justify-content:center;cursor:pointer;z-index:10;">✏</div>
        <div class="zone-copy-btn" style="display:none;position:absolute;top:-7px;right:14px;
            width:18px;height:18px;border-radius:50%;background:#374151;color:white;font-size:10px;
            align-items:center;justify-content:center;cursor:pointer;z-index:10;">📋</div>
        <div class="zone-resize-handle" style="display:none;position:absolute;bottom:-4px;right:-4px;
            width:14px;height:14px;border-radius:2px;color:#374151;font-size:18px;line-height:14px;
            text-align:center;cursor:se-resize;z-index:10;user-select:none;">⤡</div>
    `}function Ao(e){fetch("/board/zone",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,label:e.dataset.label,color_index:parseInt(e.dataset.colorIndex??0)})}).then(t=>t.json()).then(t=>{const o=t.item;H!==e&&(T(0),Z(e)),T(f+20);const n=(parseFloat(e.style.left)||0)+f,i=(parseFloat(e.style.top)||0)+f;o.pos_x=n,o.pos_y=i,o.meta.width=e.offsetWidth,o.meta.height=e.offsetHeight;const a=Xe(o);a.querySelectorAll(".zone-edit-btn, .zone-copy-btn").forEach(s=>s.style.display="none"),a.querySelectorAll(".zone-resize-handle").forEach(s=>s.style.display="none"),document.getElementById("board-canvas").appendChild(a),re(a),fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_type:"zone",item_id:parseInt(o.whiteboard_item_id),pos_x:n,pos_y:i,meta:o.meta})})})}function Po(e){if(document.querySelector(`.magnet-zone[data-zone-id="${e.whiteboard_item_id}"]`))return;const t=Xe(e);document.getElementById("board-canvas").appendChild(t),re(t)}function No(e){const t=document.querySelector(`.magnet-zone[data-zone-id="${e.zoneId}"]`);t&&t.remove()}function jo(e){var o,n,i,a;const t=document.querySelector(`.magnet-zone[data-zone-id="${e.itemId}"]`);if(t){if(t.style.left=e.posX+"px",t.style.top=e.posY+"px",(o=e.meta)!=null&&o.width&&(t.style.width=e.meta.width+"px"),(n=e.meta)!=null&&n.height&&(t.style.height=e.meta.height+"px"),((i=e.meta)==null?void 0:i.colorIndex)!==void 0){const s=ae[e.meta.colorIndex];t.style.borderColor=s.border,t.style.background=s.bg}if((a=e.meta)!=null&&a.label){const s=t.querySelector(".zone-label-text");s&&(s.textContent=e.meta.label)}}}function Fe(e){const t=e.meta??{},o=document.createElement("div");return o.className="text-box absolute cursor-grab select-none",o.dataset.textId=e.whiteboard_item_id,o.style.cssText=`
        left:${e.pos_x}px;top:${e.pos_y}px;
        width:${t.width??200}px;height:${t.height??100}px;
        position:absolute;
    `,o.innerHTML=`
        <div class="text-box-inner" data-bg-color="${t.bg_color??"transparent"}" style="
            width:100%;min-height:100%;padding:8px;
            font-size:${t.font_size??14}px;
            color:${t.color??"#374151"};
            font-weight:${t.font_weight??"400"};
            font-family:${(t.font_family??"'Kosugi Maru', sans-serif").replace(/"/g,"'")};
            text-align:${t.text_align??"left"};
            border:1.5px dashed transparent;border-radius:6px;
            background-color:${t.bg_color??"transparent"};word-break:break-all;
            box-sizing:border-box;
        ">${(t.text??"").replace(/\n/g,"<br>")}</div>
        <div class="text-edit-btn" style="
            display:none;position:absolute;top:-7px;right:-7px;
            width:18px;height:18px;border-radius:50%;
            background:#374151;color:white;font-size:10px;
            align-items:center;justify-content:center;
            cursor:pointer;z-index:10;">✏</div>
        <div class="text-copy-btn" style="
            display:none;position:absolute;top:-7px;right:14px;
            width:18px;height:18px;border-radius:50%;
            background:#374151;color:white;font-size:10px;line-height:18px;
            text-align:center;cursor:pointer;z-index:10;">📋</div>
        <div class="text-delete-btn" style="
            display:none;position:absolute;top:-7px;left:-7px;
            width:18px;height:18px;border-radius:50%;
            background:#ef4444;color:white;font-size:12px;line-height:18px;
            text-align:center;cursor:pointer;z-index:10;">×</div>
        <div class="text-resize-handle" style="
            display:none;position:absolute;bottom:-4px;right:-4px;
            width:14px;height:14px;border-radius:2px;
            color:#374151;font-size:18px;line-height:14px;text-align:center;
            cursor:se-resize;z-index:10;user-select:none;">⤡</div>
    `,o}function de(e){e.addEventListener("mousedown",a=>st(a,e)),e.addEventListener("touchstart",a=>st(a,e),{passive:!1}),e.addEventListener("mouseenter",()=>{e.querySelector(".text-edit-btn").style.display="flex",e.querySelector(".text-delete-btn").style.display="block",e.querySelector(".text-copy-btn").style.display="block",e.querySelector(".text-resize-handle").style.display="block";const a=e.querySelector(".text-box-inner");a.contentEditable!=="true"&&(a.style.borderColor="#d1d5db")}),e.addEventListener("mouseleave",()=>{e.querySelector(".text-edit-btn").style.display="none",e.querySelector(".text-delete-btn").style.display="none",e.querySelector(".text-copy-btn").style.display="none",e.querySelector(".text-resize-handle").style.display="none";const a=e.querySelector(".text-box-inner");a.contentEditable!=="true"&&(a.style.borderColor="transparent")}),e.querySelector(".text-box-inner").addEventListener("dblclick",a=>{a.stopPropagation(),at(e)});const t=e.querySelector(".text-edit-btn");t.addEventListener("mousedown",a=>a.stopPropagation()),t.addEventListener("click",a=>{a.stopPropagation(),at(e)});const o=e.querySelector(".text-delete-btn");o.addEventListener("mousedown",a=>a.stopPropagation()),o.addEventListener("click",a=>{a.stopPropagation(),confirm("このテキストを削除しますか？")&&fetch("/board/text/"+e.dataset.textId,{method:"DELETE",headers:{"X-CSRF-TOKEN":d}}).then(s=>s.json()).then(()=>e.remove())});const n=e.querySelector(".text-copy-btn");n.addEventListener("mousedown",a=>a.stopPropagation()),n.addEventListener("click",a=>{a.stopPropagation(),Ho(e)});const i=e.querySelector(".text-resize-handle");i.addEventListener("mousedown",a=>rt(a,e)),i.addEventListener("touchstart",a=>rt(a,e),{passive:!1})}function at(e){const t=e.querySelector(".text-box-inner"),o=t.textContent,n=t.style.backgroundColor||"transparent";t.contentEditable="true",t.style.cursor="text",t.style.borderColor="transparent",t.focus();const i=document.createRange();i.selectNodeContents(t),i.collapse(!1);const a=window.getSelection();a.removeAllRanges(),a.addRange(i);const s=document.createElement("div");s.className="text-toolbar",s.style.cssText=`
        position:absolute;bottom:-36px;left:0;
        display:flex;align-items:center;gap:4px;
        background:white;border:1px solid #d1d5db;border-radius:6px;
        padding:4px 6px;z-index:20;box-shadow:0 2px 6px rgba(0,0,0,0.1);
    `;const p=parseInt(t.style.fontSize)||14,u=t.style.color||"#374151",h=t.style.fontWeight==="700"||t.style.fontWeight==="bold",E=t.style.fontFamily||"'Kosugi Maru', sans-serif";s.innerHTML=`
        <select class="tb-font" data-tippy-content="フォント" style="font-size:11px;border:1px solid #e5e7eb;border-radius:4px;padding:2px 4px;width:140px;">
            <option value="'Kosugi Maru', sans-serif" style="font-family:'Kosugi Maru',sans-serif" ${E.includes("Kosugi Maru")?"selected":""}>Kosugi Maru</option>
            <option value="'Sawarabi Mincho', serif" style="font-family:'Sawarabi Mincho',serif" ${E.includes("Sawarabi Mincho")?"selected":""}>Sawarabi Mincho</option>
            <option value="'Zen Maru Gothic', sans-serif" style="font-family:'Zen Maru Gothic',sans-serif" ${E.includes("Zen Maru Gothic")?"selected":""}>Zen Maru Gothic</option>
            <option value="'Kiwi Maru', serif" style="font-family:'Kiwi Maru',serif" ${E.includes("Kiwi Maru")?"selected":""}>Kiwi Maru</option>
            <option value="'Hachi Maru Pop', cursive" style="font-family:'Hachi Maru Pop',cursive" ${E.includes("Hachi Maru Pop")?"selected":""}>Hachi Maru Pop</option>
            <option value="'Potta One', cursive" style="font-family:'Potta One',cursive" ${E.includes("Potta One")?"selected":""}>Potta One</option>
        </select>
        <select class="tb-size" data-tippy-content="フォントサイズ" style="font-size:11px;border:1px solid #e5e7eb;border-radius:4px;padding:2px 4px;">
            ${[10,12,14,16,18,20,24,28,32,40].map(r=>`<option value="${r}" ${r===p?"selected":""}>${r}px</option>`).join("")}
        </select>
        <div class="tb-color-wrap" style="position:relative;">
            <button class="tb-color-btn" data-tippy-content="文字色" style="
                width:24px;height:24px;border:1px solid #e5e7eb;border-radius:4px;
                cursor:pointer;font-size:14px;font-weight:700;line-height:24px;
                text-align:center;background:white;color:${u};">A</button>
            <div class="tb-color-palette" style="
                display:none;position:absolute;top:-112px;left:0;
                background:white;border:1px solid #d1d5db;border-radius:6px;
                padding:4px;box-shadow:0 2px 6px rgba(0,0,0,0.15);z-index:30;">
                <div style="display:flex;flex-wrap:wrap;gap:3px;width:${10*23}px;">
                    ${V.map(r=>`
                        <div class="tb-color-chip" data-color="${r}" style="
                            width:20px;height:20px;border-radius:4px;cursor:pointer;
                            background:${r};border:1.5px solid ${r==="#ffffff"?"#d1d5db":r};
                        "></div>
                    `).join("")}
                </div>
            </div>
        </div>
        <div class="tb-bg-wrap" style="position:relative;">
            <button class="tb-bg-btn" data-tippy-content="背景色" style="
                width:24px;height:24px;border:1px solid #e5e7eb;border-radius:4px;
                cursor:pointer;display:flex;align-items:center;justify-content:center;
                background-color:${n==="transparent"?"#ffffff":n};
            "><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#374151" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 10l5-5 3 3-5 5H1v-3z" fill="${n==="transparent"?"none":n}"/>
                <path d="M6 5l2-2"/>
                <path d="M11.5 9.5c0 1.1-.7 2-1.5 2s-1.5-.9-1.5-2c0-1.5 1.5-3 1.5-3s1.5 1.5 1.5 3z" fill="#374151"/>
            </svg></button>
            <div class="tb-bg-palette" style="
                display:none;position:absolute;top:-112px;left:0;
                background:white;border:1px solid #d1d5db;border-radius:6px;
                padding:4px;box-shadow:0 2px 6px rgba(0,0,0,0.15);z-index:30;">
                <div style="display:flex;flex-wrap:wrap;gap:3px;width:${10*23}px;">
                    <div class="tb-bg-chip" data-color="transparent" style="
                            width:20px;height:20px;border-radius:4px;cursor:pointer;
                            background:white;border:1.5px solid #d1d5db;position:relative;overflow:hidden;
                        "><div style="position:absolute;top:50%;left:-2px;width:28px;height:1.5px;background:#ef4444;transform:rotate(-45deg);"></div></div>
                        ${V.map(r=>`
                            <div class="tb-bg-chip" data-color="${r}" style="
                            width:20px;height:20px;border-radius:4px;cursor:pointer;
                            background:${r};border:1.5px solid ${r==="#ffffff"?"#d1d5db":r};
                        "></div>
                    `).join("")}
                </div>
            </div>
        </div>
        <button class="tb-bold" data-tippy-content="太字" style="
            font-size:12px;font-weight:700;width:24px;height:24px;
            border:1px solid ${h?"#374151":"#e5e7eb"};
            border-radius:4px;cursor:pointer;
            background:${h?"#f3f4f6":"transparent"};
            color:#374151;">B</button>
        <button class="tb-align" data-align="left" data-tippy-content="左寄せ" style="
            width:24px;height:24px;border:1px solid #e5e7eb;border-radius:4px;
            cursor:pointer;background:white;display:flex;align-items:center;justify-content:center;
        "><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#374151" stroke-width="1.5" stroke-linecap="round">
            <line x1="1" y1="3" x2="13" y2="3"/><line x1="1" y1="7" x2="9" y2="7"/><line x1="1" y1="11" x2="11" y2="11"/>
        </svg></button>
        <button class="tb-align" data-align="center" data-tippy-content="中央" style="
            width:24px;height:24px;border:1px solid #e5e7eb;border-radius:4px;
            cursor:pointer;background:white;display:flex;align-items:center;justify-content:center;
        "><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#374151" stroke-width="1.5" stroke-linecap="round">
            <line x1="1" y1="3" x2="13" y2="3"/><line x1="3" y1="7" x2="11" y2="7"/><line x1="2" y1="11" x2="12" y2="11"/>
        </svg></button>
        <button class="tb-align" data-align="right" data-tippy-content="右寄せ" style="
            width:24px;height:24px;border:1px solid #e5e7eb;border-radius:4px;
            cursor:pointer;background:white;display:flex;align-items:center;justify-content:center;
        "><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#374151" stroke-width="1.5" stroke-linecap="round">
            <line x1="1" y1="3" x2="13" y2="3"/><line x1="5" y1="7" x2="13" y2="7"/><line x1="3" y1="11" x2="13" y2="11"/>
        </svg></button>
    `,e.appendChild(s),tippy(s.querySelectorAll("[data-tippy-content]"),{duration:500,maxWidth:"none",allowHTML:!0,placement:"top",theme:"tippy_main_theme"}),s.addEventListener("mousedown",r=>{r.stopPropagation(),r.target.closest("select")||r.preventDefault()}),s.querySelector(".tb-font").addEventListener("change",r=>{t.style.fontFamily=r.target.value}),s.querySelector(".tb-size").addEventListener("change",r=>{t.style.fontSize=r.target.value+"px"}),s.querySelector(".tb-bold").addEventListener("click",r=>{const A=t.style.fontWeight==="700";t.style.fontWeight=A?"400":"700",r.target.style.borderColor=A?"#e5e7eb":"#374151",r.target.style.background=A?"transparent":"#f3f4f6"}),s.querySelectorAll(".tb-align").forEach(r=>{r.dataset.align===(t.style.textAlign||"left")&&(r.style.borderColor="#374151",r.style.background="#f3f4f6"),r.addEventListener("click",()=>{t.style.textAlign=r.dataset.align,s.querySelectorAll(".tb-align").forEach(A=>{A.style.borderColor="#e5e7eb",A.style.background="transparent"}),r.style.borderColor="#374151",r.style.background="#f3f4f6"})});const I=s.querySelector(".tb-color-btn"),w=s.querySelector(".tb-color-palette");I.addEventListener("click",()=>{w.style.display=w.style.display==="none"?"block":"none",s.querySelector(".tb-bg-palette").style.display="none"}),s.querySelectorAll(".tb-color-chip").forEach(r=>{r.addEventListener("click",()=>{t.style.color=r.dataset.color,I.style.color=r.dataset.color,w.style.display="none",t.focus()})});const et=s.querySelector(".tb-bg-btn"),ue=s.querySelector(".tb-bg-palette");et.addEventListener("click",()=>{ue.style.display=ue.style.display==="none"?"block":"none",w.style.display="none"}),s.querySelectorAll(".tb-bg-chip").forEach(r=>{r.addEventListener("click",()=>{t.style.backgroundColor=r.dataset.color,t.dataset.bgColor=r.dataset.color,et.style.backgroundColor=r.dataset.color,ue.style.display="none",t.focus()})});function ko(){t.removeEventListener("blur",he),t.contentEditable="false",t.style.cursor="inherit",t.style.borderColor="transparent",s.remove(),fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_type:"text",item_id:parseInt(e.dataset.textId),pos_x:parseFloat(e.style.left)||0,pos_y:parseFloat(e.style.top)||0,meta:{text:t.innerText.trim(),font_size:parseInt(t.style.fontSize)||14,color:t.style.color||"#374151",font_weight:t.style.fontWeight||"400",font_family:(t.style.fontFamily||"'Kosugi Maru', sans-serif").replace(/"/g,"'"),text_align:t.style.textAlign||"left",bg_color:t.dataset.bgColor||"transparent",width:e.offsetWidth,height:e.offsetHeight}})})}function he(r){if(s.contains(r.relatedTarget)){t.focus();return}t.style.borderColor="transparent",setTimeout(()=>{t.contentEditable==="true"&&ko()},50)}t.addEventListener("blur",he),t.addEventListener("keydown",r=>{r.key==="Escape"&&(t.removeEventListener("blur",he),t.textContent=o,t.contentEditable="false",t.style.cursor="inherit",t.style.borderColor="transparent",s.remove())})}let be=null,R=null,Ae=0,Pe=0,te=null,ge=0,ve=0;function st(e,t){if(e.target.classList.contains("text-edit-btn")||e.target.classList.contains("text-delete-btn")||e.target.classList.contains("text-copy-btn")||e.target.classList.contains("text-resize-handle")||e.target.contentEditable==="true")return;const o=e.touches?e.touches[0].clientX:e.clientX,n=e.touches?e.touches[0].clientY:e.clientY;te=t,ge=o,ve=n,document.addEventListener("mousemove",Ne),document.addEventListener("mouseup",je)}function Ne(e){const t=e.clientX-ge,o=e.clientY-ve;(Math.abs(t)>4||Math.abs(o)>4)&&(document.removeEventListener("mousemove",Ne),document.removeEventListener("mouseup",je),Yo(te,ge,ve),te=null)}function je(){document.removeEventListener("mousemove",Ne),document.removeEventListener("mouseup",je),te=null}function Yo(e,t,o){be=e;const n=e.getBoundingClientRect();Ae=t-n.left,Pe=o-n.top,R=e.cloneNode(!0),R.style.cssText+=`position:fixed;pointer-events:none;z-index:9998;opacity:0.7;
        left:${n.left}px;top:${n.top}px;width:${n.width}px;`,document.body.appendChild(R),e.style.opacity="0.3",document.addEventListener("mousemove",Wt),document.addEventListener("mouseup",Zt)}function Wt(e){R.style.left=e.clientX-Ae+"px",R.style.top=e.clientY-Pe+"px"}function Zt(e){document.removeEventListener("mousemove",Wt),document.removeEventListener("mouseup",Zt),R.remove(),R=null;const t=l.getBoundingClientRect(),o=be;let n=e.clientX-t.left+l.scrollLeft-Ae,i=e.clientY-t.top+l.scrollTop-Pe;n=Math.max(0,Math.min(n,Y-o.offsetWidth)),i=Math.max(0,Math.min(i,D-o.offsetHeight)),o.style.left=n+"px",o.style.top=i+"px",o.style.opacity="1",be=null;const a=o.querySelector(".text-box-inner");fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_type:"text",item_id:parseInt(o.dataset.textId),pos_x:n,pos_y:i,meta:{text:a.innerText,font_size:parseInt(a.style.fontSize)||14,color:a.style.color||"#374151",font_weight:a.style.fontWeight||"400",font_family:(a.style.fontFamily||"'Kosugi Maru', sans-serif").replace(/"/g,"'"),text_align:a.style.textAlign||"left",bg_color:a.dataset.bgColor||"transparent",width:o.offsetWidth,height:o.offsetHeight}})})}let x=null,Jt=0,Ut=0,Gt=0,Vt=0;function rt(e,t){e.stopPropagation(),e.preventDefault(),x=t,Jt=e.touches?e.touches[0].clientX:e.clientX,Ut=e.touches?e.touches[0].clientY:e.clientY,Gt=t.offsetWidth,Vt=t.offsetHeight,document.addEventListener("mousemove",Qt),document.addEventListener("mouseup",eo)}function Qt(e){if(!x)return;x.style.width=Math.max(100,Gt+(e.clientX-Jt))+"px",x.style.height=Math.max(50,Vt+(e.clientY-Ut))+"px";const t=x.querySelector(".text-box-inner");t&&(t.style.minHeight=x.style.height)}function eo(){if(document.removeEventListener("mousemove",Qt),document.removeEventListener("mouseup",eo),!x)return;const e=x.querySelector(".text-box-inner");fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_type:"text",item_id:parseInt(x.dataset.textId),pos_x:parseFloat(x.style.left)||0,pos_y:parseFloat(x.style.top)||0,meta:{text:e.innerText,font_size:parseInt(e.style.fontSize)||14,color:e.style.color||"#374151",font_weight:e.style.fontWeight||"400",font_family:(e.style.fontFamily||"'Kosugi Maru', sans-serif").replace(/"/g,"'"),text_align:e.style.textAlign||"left",bg_color:e.dataset.bgColor||"transparent",width:x.offsetWidth,height:x.offsetHeight}})}),x=null}function Do(){fetch("/board/text",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,text:"テキスト"})}).then(e=>e.json()).then(e=>{const t=Fe(e.item);document.getElementById("board-canvas").appendChild(t),de(t)})}function Ho(e){const t=e.querySelector(".text-box-inner");fetch("/board/text",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,text:t.innerText.trim()})}).then(o=>o.json()).then(o=>{const n=o.item;n.meta={...n.meta,font_size:parseInt(t.style.fontSize)||14,color:t.style.color||"#374151",font_weight:t.style.fontWeight||"400",font_family:(t.style.fontFamily||"'Kosugi Maru', sans-serif").replace(/"/g,"'"),text_align:t.style.textAlign||"left",bg_color:t.dataset.bgColor||"transparent",width:e.offsetWidth,height:e.offsetHeight},H!==e&&(T(0),Z(e)),T(f+20),n.pos_x=(parseFloat(e.style.left)||0)+f,n.pos_y=(parseFloat(e.style.top)||0)+f;const i=Fe(n);i.querySelectorAll(".text-edit-btn, .text-copy-btn, .text-delete-btn").forEach(a=>a.style.display="none"),i.querySelectorAll(".text-resize-handle").forEach(a=>a.style.display="none"),document.getElementById("board-canvas").appendChild(i),de(i),fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_type:"text",item_id:parseInt(n.whiteboard_item_id),pos_x:n.pos_x,pos_y:n.pos_y,meta:n.meta})})})}function Ko(e){setTimeout(()=>{if(document.querySelector(`.text-box[data-text-id="${e.whiteboard_item_id}"]`))return;const t=Fe(e);document.getElementById("board-canvas").appendChild(t),de(t)},100)}function Wo(e){const t=document.querySelector(`.text-box[data-text-id="${e.itemId}"]`);t&&t.remove()}function Zo(e){var o,n;const t=document.querySelector(`.text-box[data-text-id="${e.itemId}"]`);t&&(t.style.left=e.posX+"px",t.style.top=e.posY+"px",(o=e.meta)!=null&&o.width&&(t.style.width=e.meta.width+"px"),(n=e.meta)!=null&&n.height&&(t.style.height=e.meta.height+"px"))}function Ye(e,t,o,n){switch(e){case"rect":return`<rect x="2" y="2" width="96" height="96"
                fill="${t}" stroke="${o}" stroke-width="2" rx="4"
                vector-effect="non-scaling-stroke"/>`;case"circle":return`<ellipse cx="50" cy="50" rx="48" ry="48"
                fill="${t}" stroke="${o}" stroke-width="2"
                vector-effect="non-scaling-stroke"/>`;case"triangle":return`<polygon points="50,2 98,98 2,98"
                fill="${t}" stroke="${o}" stroke-width="2"
                vector-effect="non-scaling-stroke"/>`;case"star":return`<polygon points="50,2 63,38 100,38 70,60 82,98 50,75 18,98 30,60 0,38 37,38"
                fill="${t}" stroke="${o}" stroke-width="2"
                vector-effect="non-scaling-stroke"/>`;case"line":return`<line x1="0" y1="50" x2="100" y2="50"
                stroke="${o}" stroke-width="3"
                vector-effect="non-scaling-stroke"/>`;case"arrow":return`
                <polygon points="0,38 70,38 70,25 100,50 70,75 70,62 0,62"
                    fill="${t}" stroke="${o}" stroke-width="2"
                    vector-effect="non-scaling-stroke"/>`;case"double-arrow":return`
                <polygon points="0,50 30,25 30,38 70,38 70,25 100,50 70,75 70,62 30,62 30,75"
                    fill="${t}" stroke="${o}" stroke-width="2"
                    vector-effect="non-scaling-stroke"/>`;default:return""}}function De(e){const t=e.meta??{},o=t.shape_type??"rect",n=t.fill_color??"#93c5fd",i=t.stroke_color??"#2563eb",a=t.rotation??0,s=document.createElement("div");return s.className="shape-box absolute cursor-grab select-none",s.dataset.shapeId=e.whiteboard_item_id,s.dataset.shapeType=o,s.dataset.fillColor=n,s.dataset.strokeColor=i,s.dataset.rotation=a,s.style.cssText=`
        left:${e.pos_x}px;top:${e.pos_y}px;
        width:${t.width??120}px;height:${t.height??120}px;
        position:absolute;
        transform:rotate(${a}deg);
    `,s.innerHTML=`
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style="overflow:visible;">
            ${Ye(o,n,i,e.whiteboard_item_id)}
        </svg>
        <div class="shape-delete-btn" style="display:none;position:absolute;top:-7px;left:-7px;
            width:18px;height:18px;border-radius:50%;background:#ef4444;color:white;font-size:12px;
            line-height:18px;text-align:center;cursor:pointer;z-index:10;">×</div>
        <div class="shape-copy-btn" style="display:none;position:absolute;top:-7px;right:14px;
            width:18px;height:18px;border-radius:50%;background:#374151;color:white;font-size:10px;
            line-height:18px;text-align:center;cursor:pointer;z-index:10;">📋</div>
        <div class="shape-color-btn" style="display:none;position:absolute;top:-7px;right:-7px;
            width:18px;height:18px;border-radius:50%;background:#374151;color:white;font-size:10px;
            line-height:18px;text-align:center;cursor:pointer;z-index:10;">🎨</div>
        <div class="shape-resize-handle" style="display:none;position:absolute;bottom:-4px;right:-4px;
            width:14px;height:14px;border-radius:2px;color:#374151;font-size:18px;line-height:14px;
            text-align:center;cursor:se-resize;z-index:10;user-select:none;">⤡</div>
        <div class="shape-rotate-handle" style="display:none;position:absolute;top:-7px;right:35px;
            width:18px;height:18px;border-radius:50%;background:#374151;color:white;
            font-size:12px;line-height:18px;text-align:center;
            cursor:crosshair;z-index:10;user-select:none;">↻</div>
    `,s}function le(e){e.addEventListener("mousedown",s=>dt(s,e)),e.addEventListener("touchstart",s=>dt(s,e),{passive:!1}),e.addEventListener("mouseenter",()=>{e.querySelector(".shape-delete-btn").style.display="block",e.querySelector(".shape-copy-btn").style.display="block",e.querySelector(".shape-color-btn").style.display="block",e.querySelector(".shape-resize-handle").style.display="block",e.querySelector(".shape-rotate-handle").style.display="block"}),e.addEventListener("mouseleave",s=>{s.relatedTarget&&s.relatedTarget.classList.contains("shape-rotate-handle")||(e.querySelector(".shape-delete-btn").style.display="none",e.querySelector(".shape-copy-btn").style.display="none",e.querySelector(".shape-color-btn").style.display="none",e.querySelector(".shape-resize-handle").style.display="none",e.querySelector(".shape-rotate-handle").style.display="none")});const t=e.querySelector(".shape-delete-btn");t.addEventListener("mousedown",s=>s.stopPropagation()),t.addEventListener("click",s=>{s.stopPropagation(),confirm("この図形を削除しますか？")&&fetch("/board/shape/"+e.dataset.shapeId,{method:"DELETE",headers:{"X-CSRF-TOKEN":d}}).then(p=>p.json()).then(()=>e.remove())});const o=e.querySelector(".shape-copy-btn");o.addEventListener("mousedown",s=>s.stopPropagation()),o.addEventListener("click",s=>{s.stopPropagation(),Vo(e)});const n=e.querySelector(".shape-color-btn");n.addEventListener("mousedown",s=>s.stopPropagation()),n.addEventListener("click",s=>{s.stopPropagation(),Go(e)});const i=e.querySelector(".shape-resize-handle");i.addEventListener("mousedown",s=>lt(s,e)),i.addEventListener("touchstart",s=>lt(s,e),{passive:!1});const a=e.querySelector(".shape-rotate-handle");a.addEventListener("mouseleave",s=>{_||s.relatedTarget&&(s.relatedTarget===e||e.contains(s.relatedTarget))||(e.querySelector(".shape-delete-btn").style.display="none",e.querySelector(".shape-copy-btn").style.display="none",e.querySelector(".shape-color-btn").style.display="none",e.querySelector(".shape-resize-handle").style.display="none",a.style.display="none")}),a.addEventListener("mousedown",s=>Uo(s,e))}let Ee=null,X=null,He=0,Ke=0,oe=null,we=0,Se=0;function dt(e,t){if(e.target.classList.contains("shape-delete-btn")||e.target.classList.contains("shape-copy-btn")||e.target.classList.contains("shape-color-btn")||e.target.classList.contains("shape-resize-handle")||e.target.classList.contains("shape-rotate-handle"))return;const o=e.touches?e.touches[0].clientX:e.clientX,n=e.touches?e.touches[0].clientY:e.clientY;oe=t,we=o,Se=n,document.addEventListener("mousemove",We),document.addEventListener("mouseup",Ze)}function We(e){const t=e.clientX-we,o=e.clientY-Se;(Math.abs(t)>4||Math.abs(o)>4)&&(document.removeEventListener("mousemove",We),document.removeEventListener("mouseup",Ze),Jo(oe,we,Se),oe=null)}function Ze(){document.removeEventListener("mousemove",We),document.removeEventListener("mouseup",Ze),oe=null}function Jo(e,t,o){Ee=e;const n=e.getBoundingClientRect();He=t-n.left,Ke=o-n.top,X=e.cloneNode(!0),X.style.cssText+=`position:fixed;pointer-events:none;z-index:9998;opacity:0.7;
        left:${n.left}px;top:${n.top}px;width:${n.width}px;`,document.body.appendChild(X),e.style.opacity="0.3",document.addEventListener("mousemove",to),document.addEventListener("mouseup",oo)}function to(e){X.style.left=e.clientX-He+"px",X.style.top=e.clientY-Ke+"px"}function oo(e){document.removeEventListener("mousemove",to),document.removeEventListener("mouseup",oo),X.remove(),X=null;const t=l.getBoundingClientRect(),o=Ee;let n=e.clientX-t.left+l.scrollLeft-He,i=e.clientY-t.top+l.scrollTop-Ke;n=Math.max(0,Math.min(n,Y-o.offsetWidth)),i=Math.max(0,Math.min(i,D-o.offsetHeight)),o.style.left=n+"px",o.style.top=i+"px",o.style.opacity="1",Ee=null,ce(o,n,i)}function ce(e,t,o){fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_type:"shape",item_id:parseInt(e.dataset.shapeId),pos_x:t,pos_y:o,meta:{shape_type:e.dataset.shapeType,fill_color:e.dataset.fillColor,stroke_color:e.dataset.strokeColor,rotation:parseInt(e.dataset.rotation)||0,width:e.offsetWidth,height:e.offsetHeight}})})}let $=null,no=0,io=0,ao=0,so=0;function lt(e,t){e.stopPropagation(),e.preventDefault(),$=t,no=e.touches?e.touches[0].clientX:e.clientX,io=e.touches?e.touches[0].clientY:e.clientY,ao=t.offsetWidth,so=t.offsetHeight,document.addEventListener("mousemove",ro),document.addEventListener("mouseup",lo)}function ro(e){$&&($.style.width=Math.max(20,ao+(e.clientX-no))+"px",$.style.height=Math.max(20,so+(e.clientY-io))+"px")}function lo(){document.removeEventListener("mousemove",ro),document.removeEventListener("mouseup",lo),$&&(ce($,parseFloat($.style.left)||0,parseFloat($.style.top)||0),$=null)}let _=null,co=0,po=0;function Uo(e,t){e.stopPropagation(),e.preventDefault(),_=t;const o=t.getBoundingClientRect();co=o.left+o.width/2,po=o.top+o.height/2,parseInt(t.dataset.rotation),document.addEventListener("mousemove",uo),document.addEventListener("mouseup",ho)}function uo(e){if(!_)return;const t=e.clientX-co,o=e.clientY-po,n=Math.round(Math.atan2(o,t)*(180/Math.PI)+90);_.style.transform=`rotate(${n}deg)`,_.dataset.rotation=n}function ho(){document.removeEventListener("mousemove",uo),document.removeEventListener("mouseup",ho),_&&(ce(_,parseFloat(_.style.left)||0,parseFloat(_.style.top)||0),_=null)}const v=document.createElement("div");v.id="shape-color-modal";v.style.cssText=`
    display:none;position:fixed;inset:0;z-index:99999;
    background:rgba(0,0,0,0.4);
    align-items:center;justify-content:center;
`;v.innerHTML=`
    <div style="background:white;border-radius:12px;padding:24px;width:280px;">
        <p style="font-size:15px;font-weight:500;margin-bottom:16px;">色を変更</p>
        <div style="margin-bottom:16px;">
            <label style="font-size:12px;color:#6b7280;display:block;margin-bottom:6px;">塗りつぶし色</label>
            <div id="shape-fill-palette" style="display:flex;flex-wrap:wrap;gap:3px;width:${10*23}px;">
                ${V.map(e=>`
                    <div class="fill-chip" data-color="${e}" style="
                        width:20px;height:20px;border-radius:4px;cursor:pointer;
                        background:${e};border:1.5px solid ${e==="#ffffff"?"#d1d5db":e};
                    "></div>
                `).join("")}
            </div>
        </div>
        <div style="margin-bottom:20px;">
            <label style="font-size:12px;color:#6b7280;display:block;margin-bottom:6px;">枠線の色</label>
            <div id="shape-stroke-palette" style="display:flex;flex-wrap:wrap;gap:3px;width:${10*23}px;">
                ${V.map(e=>`
                    <div class="stroke-chip" data-color="${e}" style="
                        width:20px;height:20px;border-radius:4px;cursor:pointer;
                        background:${e};border:1.5px solid ${e==="#ffffff"?"#d1d5db":e};
                    "></div>
                `).join("")}
            </div>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:8px;">
            <button id="shape-color-cancel"
                    style="font-size:13px;padding:6px 16px;border:1px solid #d1d5db;
                           border-radius:6px;cursor:pointer;background:white;">
                キャンセル
            </button>
            <button id="shape-color-save"
                    style="font-size:13px;padding:6px 16px;border:none;
                           border-radius:6px;cursor:pointer;background:#374151;color:white;">
                保存
            </button>
        </div>
    </div>
`;document.body.appendChild(v);let q=null;document.getElementById("shape-color-cancel").addEventListener("click",()=>{v.style.display="none"});let K="#93c5fd",W="#2563eb";v.querySelectorAll(".fill-chip").forEach(e=>{e.addEventListener("click",()=>{K=e.dataset.color,v.querySelectorAll(".fill-chip").forEach(t=>{t.style.outline="none",t.style.transform="scale(1)"}),e.style.outline="2px solid #374151",e.style.outlineOffset="2px",e.style.transform="scale(1.2)"})});v.querySelectorAll(".stroke-chip").forEach(e=>{e.addEventListener("click",()=>{W=e.dataset.color,v.querySelectorAll(".stroke-chip").forEach(t=>{t.style.outline="none",t.style.transform="scale(1)"}),e.style.outline="2px solid #374151",e.style.outlineOffset="2px",e.style.transform="scale(1.2)"})});document.getElementById("shape-color-save").addEventListener("click",()=>{q.dataset.fillColor=K,q.dataset.strokeColor=W;const e=q.querySelector("svg");e.innerHTML=Ye(q.dataset.shapeType,K,W,q.dataset.shapeId),ce(q,parseFloat(q.style.left)||0,parseFloat(q.style.top)||0),v.style.display="none"});function Go(e){q=e,K=e.dataset.fillColor||"#93c5fd",W=e.dataset.strokeColor||"#2563eb",v.querySelectorAll(".fill-chip").forEach(t=>{const o=t.dataset.color===K;t.style.outline=o?"2px solid #374151":"none",t.style.outlineOffset="2px",t.style.transform=o?"scale(1.2)":"scale(1)"}),v.querySelectorAll(".stroke-chip").forEach(t=>{const o=t.dataset.color===W;t.style.outline=o?"2px solid #374151":"none",t.style.outlineOffset="2px",t.style.transform=o?"scale(1.2)":"scale(1)"}),v.style.display="flex"}function Vo(e){fetch("/board/shape",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,shape_type:e.dataset.shapeType})}).then(t=>t.json()).then(t=>{const o=t.item;H!==e&&(T(0),Z(e)),T(f+20);const n=(parseFloat(e.style.left)||0)+f,i=(parseFloat(e.style.top)||0)+f;o.pos_x=n,o.pos_y=i,o.meta={shape_type:e.dataset.shapeType,fill_color:e.dataset.fillColor,stroke_color:e.dataset.strokeColor,rotation:parseInt(e.dataset.rotation)||0,width:e.offsetWidth,height:e.offsetHeight};const a=De(o);a.querySelectorAll(".shape-delete-btn, .shape-copy-btn, .shape-color-btn").forEach(s=>s.style.display="none"),a.querySelectorAll(".shape-resize-handle, .shape-rotate-handle").forEach(s=>s.style.display="none"),document.getElementById("board-canvas").appendChild(a),le(a),fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_type:"shape",item_id:parseInt(o.whiteboard_item_id),pos_x:n,pos_y:i,meta:o.meta})})})}function Qo(e){fetch("/board/shape",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,shape_type:e})}).then(t=>t.json()).then(t=>{const o=De(t.item);document.getElementById("board-canvas").appendChild(o),le(o)})}function en(e){setTimeout(()=>{if(document.querySelector(`.shape-box[data-shape-id="${e.whiteboard_item_id}"]`))return;const t=De(e);document.getElementById("board-canvas").appendChild(t),le(t)},100)}function tn(e){const t=document.querySelector(`.shape-box[data-shape-id="${e.itemId}"]`);t&&t.remove()}function on(e){var o,n,i,a,s;const t=document.querySelector(`.shape-box[data-shape-id="${e.itemId}"]`);if(t&&(t.style.left=e.posX+"px",t.style.top=e.posY+"px",t.style.transform=`rotate(${((o=e.meta)==null?void 0:o.rotation)??0}deg)`,(n=e.meta)!=null&&n.width&&(t.style.width=e.meta.width+"px"),(i=e.meta)!=null&&i.height&&(t.style.height=e.meta.height+"px"),(a=e.meta)!=null&&a.fillColor||(s=e.meta)!=null&&s.strokeColor)){t.dataset.fillColor=e.meta.fillColor,t.dataset.strokeColor=e.meta.strokeColor;const p=t.querySelector("svg");p.innerHTML=Ye(t.dataset.shapeType,e.meta.fillColor,e.meta.strokeColor,e.itemId)}}function Je(e){const t=e.meta??{},o=document.createElement("div");return o.className="image-box absolute cursor-grab select-none",o.dataset.imageId=e.whiteboard_item_id,o.style.cssText=`
        left:${e.pos_x}px;top:${e.pos_y}px;
        width:${t.width??200}px;height:${t.height??200}px;
        position:absolute;
    `,o.innerHTML=`
        <img src="${t.src}" draggable="false" style="
            width:100%;height:100%;object-fit:contain;
            border-radius:4px;pointer-events:none;
        ">
        <div class="image-delete-btn" style="display:none;position:absolute;top:-7px;left:-7px;
            width:18px;height:18px;border-radius:50%;background:#ef4444;color:white;font-size:12px;
            line-height:18px;text-align:center;cursor:pointer;z-index:10;">×</div>
        <div class="image-copy-btn" style="display:none;position:absolute;top:-7px;right:-7px;
            width:18px;height:18px;border-radius:50%;background:#374151;color:white;font-size:10px;
            line-height:18px;text-align:center;cursor:pointer;z-index:10;">📋</div>
        <div class="image-resize-handle" style="display:none;position:absolute;bottom:-4px;right:-4px;
            width:14px;height:14px;border-radius:2px;color:#374151;font-size:18px;line-height:14px;
            text-align:center;cursor:se-resize;z-index:10;user-select:none;">⤡</div>
    `,o}function pe(e){e.addEventListener("mousedown",i=>ct(i,e)),e.addEventListener("touchstart",i=>ct(i,e),{passive:!1}),e.addEventListener("mouseenter",()=>{e.querySelector(".image-delete-btn").style.display="block",e.querySelector(".image-copy-btn").style.display="block",e.querySelector(".image-resize-handle").style.display="block"}),e.addEventListener("mouseleave",()=>{e.querySelector(".image-delete-btn").style.display="none",e.querySelector(".image-copy-btn").style.display="none",e.querySelector(".image-resize-handle").style.display="none"});const t=e.querySelector(".image-delete-btn");t.addEventListener("mousedown",i=>i.stopPropagation()),t.addEventListener("click",i=>{i.stopPropagation(),confirm("この画像を削除しますか？")&&fetch("/board/image/"+e.dataset.imageId,{method:"DELETE",headers:{"X-CSRF-TOKEN":d}}).then(a=>a.json()).then(()=>e.remove())});const o=e.querySelector(".image-copy-btn");o.addEventListener("mousedown",i=>i.stopPropagation()),o.addEventListener("click",i=>{i.stopPropagation(),sn(e)});const n=e.querySelector(".image-resize-handle");n.addEventListener("mousedown",i=>pt(i,e)),n.addEventListener("touchstart",i=>pt(i,e),{passive:!1})}let ze=null,F=null,Ue=0,Ge=0,ne=null,Le=0,_e=0;function ct(e,t){if(e.target.classList.contains("image-delete-btn")||e.target.classList.contains("image-copy-btn")||e.target.classList.contains("image-resize-handle"))return;const o=e.touches?e.touches[0].clientX:e.clientX,n=e.touches?e.touches[0].clientY:e.clientY;ne=t,Le=o,_e=n,document.addEventListener("mousemove",Ve),document.addEventListener("mouseup",Qe)}function Ve(e){const t=e.clientX-Le,o=e.clientY-_e;(Math.abs(t)>4||Math.abs(o)>4)&&(document.removeEventListener("mousemove",Ve),document.removeEventListener("mouseup",Qe),nn(ne,Le,_e),ne=null)}function Qe(){document.removeEventListener("mousemove",Ve),document.removeEventListener("mouseup",Qe),ne=null}function nn(e,t,o){ze=e;const n=e.getBoundingClientRect();Ue=t-n.left,Ge=o-n.top,F=e.cloneNode(!0),F.style.cssText+=`position:fixed;pointer-events:none;z-index:9998;opacity:0.7;
        left:${n.left}px;top:${n.top}px;width:${n.width}px;height:${n.height}px;`,document.body.appendChild(F),e.style.opacity="0.3",document.addEventListener("mousemove",yo),document.addEventListener("mouseup",fo)}function yo(e){F.style.left=e.clientX-Ue+"px",F.style.top=e.clientY-Ge+"px"}function fo(e){document.removeEventListener("mousemove",yo),document.removeEventListener("mouseup",fo),F.remove(),F=null;const t=l.getBoundingClientRect(),o=ze;let n=e.clientX-t.left+l.scrollLeft-Ue,i=e.clientY-t.top+l.scrollTop-Ge;n=Math.max(0,Math.min(n,Y-o.offsetWidth)),i=Math.max(0,Math.min(i,D-o.offsetHeight)),o.style.left=n+"px",o.style.top=i+"px",o.style.opacity="1",ze=null,mo(o,n,i)}function mo(e,t,o){const n=e.querySelector("img");fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_type:"image",item_id:parseInt(e.dataset.imageId),pos_x:t,pos_y:o,meta:{src:n.src.replace(location.origin,""),width:e.offsetWidth,height:e.offsetHeight}})})}let M=null,xo=0,bo=0,go=0,vo=0;function pt(e,t){e.stopPropagation(),e.preventDefault(),M=t,xo=e.touches?e.touches[0].clientX:e.clientX,bo=e.touches?e.touches[0].clientY:e.clientY,go=t.offsetWidth,vo=t.offsetHeight,document.addEventListener("mousemove",Eo),document.addEventListener("mouseup",wo)}function Eo(e){M&&(M.style.width=Math.max(40,go+(e.clientX-xo))+"px",M.style.height=Math.max(40,vo+(e.clientY-bo))+"px")}function wo(){document.removeEventListener("mousemove",Eo),document.removeEventListener("mouseup",wo),M&&(mo(M,parseFloat(M.style.left)||0,parseFloat(M.style.top)||0),M=null)}function an(){const e=document.createElement("input");e.type="file",e.accept="image/*",e.addEventListener("change",()=>{const t=e.files[0];if(!t)return;const o=new FormData;o.append("whiteboard_id",c),o.append("image",t),fetch("/board/image",{method:"POST",headers:{"X-CSRF-TOKEN":d},body:o}).then(n=>n.json()).then(n=>{const i=Je(n.item);document.getElementById("board-canvas").appendChild(i),pe(i)})}),e.click()}function sn(e){const o=e.querySelector("img").src.replace(location.origin,"");fetch("/board/image/copy",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,src:o,width:e.offsetWidth,height:e.offsetHeight})}).then(n=>n.json()).then(n=>{const i=n.item;H!==e&&(T(0),Z(e)),T(f+20),i.pos_x=(parseFloat(e.style.left)||0)+f,i.pos_y=(parseFloat(e.style.top)||0)+f;const a=Je(i);a.querySelectorAll(".image-delete-btn, .image-copy-btn").forEach(s=>s.style.display="none"),a.querySelectorAll(".image-resize-handle").forEach(s=>s.style.display="none"),document.getElementById("board-canvas").appendChild(a),pe(a),fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_type:"image",item_id:parseInt(i.whiteboard_item_id),pos_x:i.pos_x,pos_y:i.pos_y,meta:i.meta})})})}function rn(e){setTimeout(()=>{if(document.querySelector(`.image-box[data-image-id="${e.whiteboard_item_id}"]`))return;const t=Je(e);document.getElementById("board-canvas").appendChild(t),pe(t)},100)}function dn(e){const t=document.querySelector(`.image-box[data-image-id="${e.itemId}"]`);t&&t.remove()}function ln(e){var o,n;const t=document.querySelector(`.image-box[data-image-id="${e.itemId}"]`);t&&(t.style.left=e.posX+"px",t.style.top=e.posY+"px",(o=e.meta)!=null&&o.width&&(t.style.width=e.meta.width+"px"),(n=e.meta)!=null&&n.height&&(t.style.height=e.meta.height+"px"))}window.addStaff=Io;window.addZone=Xo;window.addText=Do;window.addShape=Qo;window.clearBoard=cn;window.addImage=an;document.querySelectorAll(".magnet").forEach(e=>se(e));document.querySelectorAll(".magnet-zone").forEach(e=>re(e));document.querySelectorAll(".text-box").forEach(e=>de(e));document.querySelectorAll(".shape-box").forEach(e=>le(e));document.querySelectorAll(".image-box").forEach(e=>pe(e));let ie=!1,So=0,zo=0,Lo=0,_o=0;l.addEventListener("mousedown",e=>{if(e.target===l||e.target.id==="board-canvas"||e.target.closest("#board-canvas")===document.getElementById("board-canvas")&&!e.target.closest(".magnet")&&!e.target.closest(".magnet-zone")&&!e.target.closest(".text-box")&&!e.target.closest(".shape-box")&&!e.target.closest(".image-box")){const t=document.querySelector('.text-box-inner[contenteditable="true"]');if(t){t.blur();return}ie=!0,So=e.clientX,zo=e.clientY,Lo=l.scrollLeft,_o=l.scrollTop,l.style.cursor="grabbing",e.preventDefault()}});document.addEventListener("mousemove",e=>{ie&&(l.scrollLeft=Lo-(e.clientX-So),l.scrollTop=_o-(e.clientY-zo))});document.addEventListener("mouseup",()=>{ie&&(ie=!1,l.style.cursor="default")});document.getElementById("board-canvas").addEventListener("mousedown",e=>{if(e.target.closest(".text-box"))return;const t=document.querySelector('.text-box-inner[contenteditable="true"]');t&&t.blur()});window.Echo.channel("whiteboard."+c).listen(".board.updated",e=>{switch(e.action){case"item.updated":e.payload.itemType==="staff"&&Oo(e.payload),e.payload.itemType==="zone"&&jo(e.payload),e.payload.itemType==="text"&&Zo(e.payload),e.payload.itemType==="shape"&&on(e.payload),e.payload.itemType==="image"&&ln(e.payload);break;case"staff.added":$o(e.payload);break;case"staff.deleted":Mo(e.payload);break;case"zone.added":Po(e.payload);break;case"zone.deleted":No(e.payload);break;case"text.added":Ko(e.payload);break;case"text.deleted":Wo(e.payload);break;case"shape.added":en(e.payload);break;case"shape.deleted":tn(e.payload);break;case"image.added":rn(e.payload);break;case"image.deleted":dn(e.payload);break}});const J=24,ut=120,U=document.getElementById("ruler-top-inner"),G=document.getElementById("ruler-left-inner");if(U&&G){for(let e=0;e<=Y;e+=J){const t=e%ut===0,o=document.createElement("div");if(o.style.cssText=`position:absolute;left:${e}px;bottom:0;width:1px;
            height:${t?6:3}px;background:${t?"#9ca3af":"#c8c6be"};`,U.appendChild(o),t){const n=document.createElement("div");n.style.cssText=`position:absolute;left:${e+2}px;top:3px;
                font-size:9px;color:#9ca3af;`,n.textContent=e/J,U.appendChild(n)}}for(let e=0;e<=D;e+=J){const t=e%ut===0,o=document.createElement("div");if(o.style.cssText=`position:absolute;top:${e}px;right:0;height:1px;
            width:${t?6:3}px;background:${t?"#9ca3af":"#c8c6be"};`,G.appendChild(o),t){const n=document.createElement("div");n.style.cssText=`position:absolute;top:${e+2}px;left:1px;
                font-size:9px;color:#9ca3af;`,n.textContent=e/J,G.appendChild(n)}}l.addEventListener("scroll",()=>{U.style.transform=`translateX(-${l.scrollLeft}px)`,G.style.transform=`translateY(-${l.scrollTop}px)`})}function cn(){confirm(`ボード上の全ての要素を削除しますか？
この操作は元に戻せません。`)&&fetch("/board/clear",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c})}).then(e=>e.json()).then(()=>{document.querySelectorAll(".magnet").forEach(e=>e.remove()),document.querySelectorAll(".magnet-zone").forEach(e=>e.remove()),document.querySelectorAll(".text-box").forEach(e=>e.remove()),document.querySelectorAll(".shape-box").forEach(e=>e.remove()),document.querySelectorAll(".image-box").forEach(e=>e.remove())})}window.addEventListener("load",()=>{setTimeout(()=>{document.getElementById("wb-toolbar").style.display="flex"},505)});
