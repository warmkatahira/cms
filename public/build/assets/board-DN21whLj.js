const l=document.getElementById("board");document.getElementById("tray");const c=parseInt(l.dataset.whiteboardId),P=parseInt(l.dataset.canvasW),N=parseInt(l.dataset.canvasH),d=document.querySelector('meta[name="csrf-token"]').content,T=[{bg:"#E6F1FB",border:"#378ADD",text:"#0C447C"},{bg:"#EAF3DE",border:"#639922",text:"#27500A"},{bg:"#FAEEDA",border:"#BA7517",text:"#633806"},{bg:"#FBEAF0",border:"#D4537E",text:"#72243E"},{bg:"#E1F5EE",border:"#1D9E75",text:"#085041"},{bg:"#EEEDFE",border:"#7F77DD",text:"#3C3489"},{bg:"#FAECE7",border:"#D85A30",text:"#711B13"},{bg:"#FEF9E7",border:"#D4AC0D",text:"#7D6608"},{bg:"#F2F3F4",border:"#717D7E",text:"#2C3E50"},{bg:"#FDEDEC",border:"#C0392B",text:"#7B241C"}],ie=[{border:"#378ADD",bg:"rgba(56,138,221,0.06)",text:"#0C447C"},{border:"#639922",bg:"rgba(99,153,34,0.06)",text:"#27500A"},{border:"#D4537E",bg:"rgba(212,83,126,0.06)",text:"#72243E"},{border:"#BA7517",bg:"rgba(186,117,23,0.06)",text:"#633806"},{border:"#7F77DD",bg:"rgba(127,119,221,0.06)",text:"#3C3489"},{border:"#1D9E75",bg:"rgba(29,158,117,0.06)",text:"#085041"},{border:"#D85A30",bg:"rgba(216,90,48,0.06)",text:"#711B13"},{border:"#D4AC0D",bg:"rgba(212,172,13,0.06)",text:"#7D6608"},{border:"#717D7E",bg:"rgba(113,125,126,0.06)",text:"#2C3E50"},{border:"#C0392B",bg:"rgba(192,57,43,0.06)",text:"#7B241C"}],G=["#374151","#ffffff","#dc2626","#ea580c","#ca8a04","#16a34a","#2563eb","#7c3aed","#ec4899","#000000","#6b7280","#b91c1c","#92400e","#854d0e","#065f46","#1e40af","#5b21b6","#9d174d","#0891b2","#fca5a5","#fdba74","#fde047","#86efac","#93c5fd","#c4b5fd","#f9a8d4","#67e8f9","#9ca3af","#e5e7eb"];let u=0,j=null;function w(e){u=e}function K(e){j=e}let x=null,E=null,_e=0,Ce=0,V=null,he=0,ye=0;function se(e){e.addEventListener("mousedown",i=>tt(i,e)),e.addEventListener("touchstart",i=>tt(i,e),{passive:!1}),e.addEventListener("mouseenter",()=>{const i=e.querySelector(".chip-edit-btn");i&&(i.style.display="flex");const s=e.querySelector(".chip-copy-btn");s&&(s.style.display="flex");const a=e.querySelector(".chip-resize-handle");a&&(a.style.display="block")}),e.addEventListener("mouseleave",()=>{const i=e.querySelector(".chip-edit-btn");i&&(i.style.display="none");const s=e.querySelector(".chip-copy-btn");s&&(s.style.display="none");const a=e.querySelector(".chip-resize-handle");a&&(a.style.display="none")});const t=e.querySelector(".chip-edit-btn");t&&(t.addEventListener("mousedown",i=>i.stopPropagation()),t.addEventListener("click",i=>{i.stopPropagation(),To(i,e)}));const o=e.querySelector(".chip-copy-btn");o&&(o.addEventListener("mousedown",i=>i.stopPropagation()),o.addEventListener("click",i=>{i.stopPropagation(),qo(e)}));const n=e.querySelector(".chip-resize-handle");n&&(n.addEventListener("mousedown",i=>ot(i,e)),n.addEventListener("touchstart",i=>ot(i,e),{passive:!1}))}function tt(e,t){x&&(x.style.opacity="1",x=null),E&&(E.remove(),E=null);const o=e.touches?e.touches[0].clientX:e.clientX,n=e.touches?e.touches[0].clientY:e.clientY;V=t,he=o,ye=n,document.addEventListener("mousemove",ke),document.addEventListener("mouseup",Te)}function ke(e){const t=e.clientX-he,o=e.clientY-ye;(Math.abs(t)>4||Math.abs(o)>4)&&(document.removeEventListener("mousemove",ke),document.removeEventListener("mouseup",Te),ko(V,he,ye),V=null)}function Te(){document.removeEventListener("mousemove",ke),document.removeEventListener("mouseup",Te),V=null}function ko(e,t,o){x=e;const n=e.getBoundingClientRect();_e=t-n.left,Ce=o-n.top,E=e.cloneNode(!0),E.style.cssText=`
        position:fixed;pointer-events:none;z-index:9999;opacity:0.85;
        left:${n.left}px;top:${n.top}px;
        transform:rotate(2deg) scale(1.05);
    `,document.body.appendChild(E),e.style.opacity="0.3",document.addEventListener("mousemove",ht),document.addEventListener("mouseup",mt),document.addEventListener("touchmove",yt,{passive:!1}),document.addEventListener("touchend",bt)}function ht(e){ft(e.clientX,e.clientY)}function yt(e){e.preventDefault(),ft(e.touches[0].clientX,e.touches[0].clientY)}function ft(e,t){E.style.left=e-_e+"px",E.style.top=t-Ce+"px"}function mt(e){xt(e.clientX,e.clientY)}function bt(e){xt(e.changedTouches[0].clientX,e.changedTouches[0].clientY)}function xt(e,t){document.removeEventListener("mousemove",ht),document.removeEventListener("mouseup",mt),document.removeEventListener("touchmove",yt),document.removeEventListener("touchend",bt),E.remove(),E=null;const o=l.getBoundingClientRect(),n=x.dataset.id;if(e>=o.left&&e<=o.right&&t>=o.top&&t<=o.bottom){let s=e-o.left+l.scrollLeft-_e,a=t-o.top+l.scrollTop-Ce;s=Math.max(0,Math.min(s,P-80)),a=Math.max(0,Math.min(a,N-50)),Ie(n,!0,s,a),x.style.position="absolute",x.style.left=s+"px",x.style.top=a+"px",document.getElementById("board-canvas").appendChild(x)}x.style.opacity="1",x=null}function Ie(e,t,o,n){const i=document.querySelector(`.magnet[data-id="${e}"]`),s=i?i.querySelector(".staff-chip-wrap > div"):null,a=s?{width:s.offsetWidth,height:s.offsetHeight}:null;fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_id:parseInt(e),on_board:t,pos_x:o,pos_y:n,meta:a})})}let L=null,gt=0,vt=0,Et=0,St=0;function ot(e,t){e.stopPropagation(),e.preventDefault(),L=t,gt=e.touches?e.touches[0].clientX:e.clientX,vt=e.touches?e.touches[0].clientY:e.clientY;const o=t.querySelector(".staff-chip-wrap > div");Et=o?o.offsetWidth:90,St=o?o.offsetHeight:40,document.addEventListener("mousemove",wt),document.addEventListener("mouseup",_t),document.addEventListener("touchmove",zt,{passive:!1}),document.addEventListener("touchend",Ct)}function wt(e){Lt(e.clientX,e.clientY)}function zt(e){e.preventDefault(),Lt(e.touches[0].clientX,e.touches[0].clientY)}function Lt(e,t){if(!L)return;const o=L.querySelector(".staff-chip-wrap > div");o&&(o.style.width=Math.max(50,Et+(e-gt))+"px",o.style.height=Math.max(50,St+(t-vt))+"px")}function _t(){kt()}function Ct(){kt()}function kt(){if(document.removeEventListener("mousemove",wt),document.removeEventListener("mouseup",_t),document.removeEventListener("touchmove",zt),document.removeEventListener("touchend",Ct),!L)return;const e=L.querySelector(".staff-chip-wrap > div"),t=L.dataset.id;fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_id:parseInt(t),on_board:!0,pos_x:parseFloat(L.style.left)||0,pos_y:parseFloat(L.style.top)||0,meta:{width:e?e.offsetWidth:90,height:e?e.offsetHeight:40}})}),L=null}let qe=null,k=null,X=0,Tt="M",I="rect";const p=document.createElement("div");p.id="staff-edit-modal";p.style.cssText=`
    display:none;position:fixed;inset:0;z-index:99999;
    background:rgba(0,0,0,0.4);
    align-items:center;justify-content:center;
`;p.innerHTML=`
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
                    ${T.map((e,t)=>`
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
`;document.body.appendChild(p);p.querySelectorAll(".modal-tab").forEach(e=>{e.addEventListener("click",()=>{p.querySelectorAll(".modal-tab").forEach(t=>{t.style.borderBottomColor="transparent",t.style.color="#9ca3af"}),e.style.borderBottomColor="#374151",e.style.color="#374151",document.getElementById("tab-basic").style.display=e.dataset.tab==="basic"?"block":"none",document.getElementById("tab-appearance").style.display=e.dataset.tab==="appearance"?"block":"none"})});p.querySelectorAll(".edit-color-chip").forEach(e=>{e.addEventListener("click",()=>{X=parseInt(e.dataset.color),p.querySelectorAll(".edit-color-chip").forEach(t=>{t.style.transform="scale(1)",t.style.outline="none"}),e.style.transform="scale(1.2)",e.style.outline="2px solid #374151",e.style.outlineOffset="2px"})});p.querySelectorAll(".edit-shape-chip").forEach(e=>{e.addEventListener("click",()=>{I=e.dataset.shape,p.querySelectorAll(".edit-shape-chip").forEach(t=>{t.style.borderColor="#d1d5db",t.style.background="white"}),e.style.borderColor="#374151",e.style.background="#f3f4f6"})});document.getElementById("edit-cancel").addEventListener("click",()=>{p.style.display="none"});function To(e,t){e.preventDefault(),qe=t.dataset.id,k=t;const o=p.querySelector('.modal-tab[data-tab="appearance"]');o&&(o.style.display="block"),document.getElementById("edit-name").value=t.dataset.name??"",document.getElementById("edit-role").value=t.dataset.role??"",X=parseInt(t.dataset.color??0)||0,Tt=t.dataset.size??"M",I=t.dataset.shape??"rect",p.querySelectorAll(".edit-color-chip").forEach(i=>{i.style.transform="scale(1)",i.style.outline="none"});const n=p.querySelector(`.edit-color-chip[data-color="${X}"]`);n&&(n.style.transform="scale(1.2)",n.style.outline="2px solid #374151",n.style.outlineOffset="2px"),p.querySelectorAll(".edit-shape-chip").forEach(i=>{const s=i.dataset.shape===I;i.style.borderColor=s?"#374151":"#d1d5db",i.style.background=s?"#f3f4f6":"white"}),document.getElementById("tab-basic").style.display="block",document.getElementById("tab-appearance").style.display="none",p.querySelectorAll(".modal-tab").forEach(i=>{const s=i.dataset.tab==="basic";i.style.borderBottomColor=s?"#374151":"transparent",i.style.color=s?"#374151":"#9ca3af"}),p.style.display="flex"}document.getElementById("edit-save").addEventListener("click",()=>{const e=document.getElementById("edit-name").value.trim(),t=document.getElementById("edit-role").value.trim();e&&fetch("/board/staff/"+qe,{method:"PATCH",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({staff_name:e,role_name:t,color:X,shape:I})}).then(o=>o.json()).then(()=>{const o=T[X],n=k.querySelector(".staff-chip-wrap"),i=n.querySelector("div"),s={rect:"border-radius:8px;clip-path:none;",circle:"border-radius:50%;clip-path:none;",sharp:"border-radius:0;clip-path:none;",rounded_bottom:"border-radius:0 0 50% 50%;clip-path:none;",tab:"border-radius:0 0 8px 8px;clip-path:none;"};i.style.cssText=`
            background:${o.bg};
            border:2px solid ${o.border};
            border-top:${I==="tab"?"4px":"2px"} solid ${o.border};
            width:${i.style.width||i.offsetWidth+"px"};
            height:${i.style.height||i.offsetHeight+"px"};
            padding:6px;text-align:center;
            ${s[I]??s.rect}
        `,k.dataset.shape=I,k.dataset.size=Tt,k.dataset.color=X,k.dataset.name=e,k.dataset.role=t;const a=n.querySelector('[data-field="name"]'),b=n.querySelector('[data-field="role"]');a&&(a.textContent=e,a.style.color=o.text),b&&(b.textContent=t,b.style.color=o.text),p.style.display="none"})});document.getElementById("edit-delete").addEventListener("click",()=>{confirm("このスタッフを削除しますか？")&&fetch("/board/staff/"+qe,{method:"DELETE",headers:{"X-CSRF-TOKEN":d}}).then(e=>e.json()).then(()=>{k.remove(),p.style.display="none"})});function Io(){const e=document.getElementById("newName").value.trim(),t=document.getElementById("newRole").value.trim();e&&fetch("/board/staff",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,staff_name:e,role_name:t})}).then(o=>o.json()).then(o=>{const n=o.staff,i=T[(n.color??0)%T.length],s=document.createElement("div");s.className="magnet absolute cursor-grab select-none",s.dataset.id=n.staff_id,s.dataset.color=n.color,s.dataset.name=n.staff_name,s.dataset.role=n.role_name??"",s.dataset.size=n.size??"M",s.dataset.shape=n.shape??"rect",s.style.left="40px",s.style.top="40px",s.innerHTML=It(n.staff_name,n.role_name??"",i),se(s),document.getElementById("board-canvas").appendChild(s),Ie(n.staff_id,!0,40,40),document.getElementById("newName").value="",document.getElementById("newRole").value=""})}function It(e,t,o){return`
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
        </div>`}function qo(e){fetch("/board/staff",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,staff_name:e.dataset.name,role_name:e.dataset.role,color:parseInt(e.dataset.color)||0})}).then(t=>t.json()).then(t=>{const o=t.staff,n=document.createElement("div");n.className="magnet absolute cursor-grab select-none",n.dataset.id=o.staff_id,n.dataset.color=o.color,n.dataset.name=o.staff_name,n.dataset.role=o.role_name??"",n.dataset.size=e.dataset.size??"M",n.dataset.shape=e.dataset.shape??"rect",n.innerHTML=e.innerHTML,n.querySelectorAll(".chip-edit-btn, .chip-copy-btn").forEach(a=>a.style.display="none"),n.querySelectorAll(".chip-resize-handle").forEach(a=>a.style.display="none"),se(n),j!==e&&(w(0),K(e)),w(u+20);const i=(parseFloat(e.style.left)||0)+u,s=(parseFloat(e.style.top)||0)+u;n.style.left=i+"px",n.style.top=s+"px",document.getElementById("board-canvas").appendChild(n),Ie(o.staff_id,!0,i,s)})}function $o(e){setTimeout(()=>{if(document.querySelector(`.magnet[data-id="${e.staff_id}"]`))return;const t=T[(e.color??0)%T.length],o=document.createElement("div");o.className="magnet absolute cursor-grab select-none",o.dataset.id=e.staff_id,o.dataset.color=e.color??0,o.dataset.name=e.staff_name,o.dataset.role=e.role_name??"",o.dataset.shape=e.shape??"rect",o.style.left="40px",o.style.top="40px",o.innerHTML=It(e.staff_name,e.role_name??"",t),se(o),document.getElementById("board-canvas").appendChild(o)},100)}function Mo(e){const t=document.querySelector(`.magnet[data-id="${e.staffId}"]`);t&&t.remove()}function Oo(e){const t=document.querySelector(`.magnet[data-id="${e.staff_id}"]`);if(!t)return;const o=T[(e.color??0)%T.length],n=t.querySelector(".staff-chip-wrap"),i=n==null?void 0:n.querySelector("div");if(!i)return;const s=i.style.width||i.offsetWidth+"px",a=i.style.height||i.offsetHeight+"px",b={rect:"border-radius:8px;",circle:"border-radius:50%;",sharp:"border-radius:0;",rounded_bottom:"border-radius:0 0 50% 50%;",tab:"border-radius:0 0 8px 8px;"};i.style.cssText=`
        background:${o.bg};border:2px solid ${o.border};
        width:${s};height:${a};
        padding:6px;text-align:center;
        ${b[e.shape]??b.rect}
    `,t.dataset.name=e.staff_name,t.dataset.role=e.role_name??"",t.dataset.color=e.color??0,t.dataset.shape=e.shape??"rect";const Y=n.querySelector('[data-field="name"]'),O=n.querySelector('[data-field="role"]');Y&&(Y.textContent=e.staff_name,Y.style.color=o.text),O&&(O.textContent=e.role_name??"",O.style.color=o.text)}function Bo(e){var o,n;const t=document.querySelector(`.magnet[data-id="${e.itemId}"]`);t&&e.onBoard&&(t.style.position="absolute",t.style.left=e.posX+"px",t.style.top=e.posY+"px",(o=e.meta)!=null&&o.width&&(t.querySelector(".staff-chip-wrap > div").style.width=e.meta.width+"px"),(n=e.meta)!=null&&n.height&&(t.querySelector(".staff-chip-wrap > div").style.height=e.meta.height+"px"),document.getElementById("board-canvas").appendChild(t))}let F=null,S=null,$e=0,Me=0,Q=null,fe=0,me=0;function ae(e){e.addEventListener("mousedown",i=>nt(i,e)),e.addEventListener("touchstart",i=>nt(i,e),{passive:!1}),e.addEventListener("mouseenter",()=>{const i=e.querySelector(".zone-edit-btn");i&&(i.style.display="flex");const s=e.querySelector(".zone-copy-btn");s&&(s.style.display="flex");const a=e.querySelector(".zone-resize-handle");a&&(a.style.display="block")}),e.addEventListener("mouseleave",()=>{const i=e.querySelector(".zone-edit-btn");i&&(i.style.display="none");const s=e.querySelector(".zone-copy-btn");s&&(s.style.display="none");const a=e.querySelector(".zone-resize-handle");a&&(a.style.display="none")});const t=e.querySelector(".zone-edit-btn");t&&(t.addEventListener("mousedown",i=>i.stopPropagation()),t.addEventListener("click",i=>{i.stopPropagation(),Xo(e)}));const o=e.querySelector(".zone-copy-btn");o&&(o.addEventListener("mousedown",i=>i.stopPropagation()),o.addEventListener("click",i=>{i.stopPropagation(),Po(e)}));const n=e.querySelector(".zone-resize-handle");n&&(n.addEventListener("mousedown",i=>it(i,e)),n.addEventListener("touchstart",i=>it(i,e),{passive:!1}))}function nt(e,t){if(e.target.classList.contains("zone-edit-btn")||e.target.classList.contains("zone-copy-btn"))return;F&&(F.style.opacity="1",F=null),S&&(S.remove(),S=null);const o=e.touches?e.touches[0].clientX:e.clientX,n=e.touches?e.touches[0].clientY:e.clientY;Q=t,fe=o,me=n,document.addEventListener("mousemove",Oe),document.addEventListener("mouseup",Be)}function Oe(e){const t=e.clientX-fe,o=e.clientY-me;(Math.abs(t)>4||Math.abs(o)>4)&&(document.removeEventListener("mousemove",Oe),document.removeEventListener("mouseup",Be),Ro(Q,fe,me),Q=null)}function Be(){document.removeEventListener("mousemove",Oe),document.removeEventListener("mouseup",Be),Q=null}function Ro(e,t,o){F=e;const n=e.getBoundingClientRect();$e=t-n.left,Me=o-n.top,S=e.cloneNode(!0),S.style.cssText=`
        position:fixed;pointer-events:none;z-index:9998;opacity:0.7;
        left:${n.left}px;top:${n.top}px;
        width:${n.width}px;height:${n.height}px;
    `,document.body.appendChild(S),e.style.opacity="0.3",document.addEventListener("mousemove",qt),document.addEventListener("mouseup",Ot),document.addEventListener("touchmove",$t,{passive:!1}),document.addEventListener("touchend",Bt)}function qt(e){Mt(e.clientX,e.clientY)}function $t(e){e.preventDefault(),Mt(e.touches[0].clientX,e.touches[0].clientY)}function Mt(e,t){S.style.left=e-$e+"px",S.style.top=t-Me+"px"}function Ot(e){Rt(e.clientX,e.clientY)}function Bt(e){Rt(e.changedTouches[0].clientX,e.changedTouches[0].clientY)}function Rt(e,t){document.removeEventListener("mousemove",qt),document.removeEventListener("mouseup",Ot),document.removeEventListener("touchmove",$t),document.removeEventListener("touchend",Bt),S.remove(),S=null;const o=l.getBoundingClientRect(),n=F,i=n.dataset.zoneId;let s=e-o.left+l.scrollLeft-$e,a=t-o.top+l.scrollTop-Me;s=Math.max(0,Math.min(s,P-n.offsetWidth)),a=Math.max(0,Math.min(a,N-n.offsetHeight)),n.style.left=s+"px",n.style.top=a+"px",n.style.opacity="1",F=null,fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_type:"zone",item_id:parseInt(i),on_board:!0,pos_x:s,pos_y:a,meta:{color_index:parseInt(n.dataset.colorIndex??0),label:n.dataset.label??"",width:n.offsetWidth,height:n.offsetHeight}})})}let f=null,Xt=0,Ft=0,At=0,Pt=0;function it(e,t){e.stopPropagation(),e.preventDefault(),f=t,Xt=e.touches?e.touches[0].clientX:e.clientX,Ft=e.touches?e.touches[0].clientY:e.clientY,At=t.offsetWidth,Pt=t.offsetHeight,document.addEventListener("mousemove",Nt),document.addEventListener("mouseup",Dt),document.addEventListener("touchmove",jt,{passive:!1}),document.addEventListener("touchend",Ht)}function Nt(e){Yt(e.clientX,e.clientY)}function jt(e){e.preventDefault(),Yt(e.touches[0].clientX,e.touches[0].clientY)}function Yt(e,t){f&&(f.style.width=Math.max(100,At+(e-Xt))+"px",f.style.height=Math.max(80,Pt+(t-Ft))+"px")}function Dt(e){Kt()}function Ht(e){Kt()}function Kt(){document.removeEventListener("mousemove",Nt),document.removeEventListener("mouseup",Dt),document.removeEventListener("touchmove",jt),document.removeEventListener("touchend",Ht),f&&(fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_type:"zone",item_id:parseInt(f.dataset.zoneId),on_board:!0,pos_x:parseFloat(f.style.left)||0,pos_y:parseFloat(f.style.top)||0,meta:{color_index:parseInt(f.dataset.colorIndex??0),label:f.dataset.label??"",width:f.offsetWidth,height:f.offsetHeight}})}),f=null)}let h=null,A=0;const g=document.createElement("div");g.id="zone-edit-modal";g.style.cssText=`
    display:none;position:fixed;inset:0;z-index:99999;
    background:rgba(0,0,0,0.4);
    align-items:center;justify-content:center;
`;g.innerHTML=`
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
                ${ie.map((e,t)=>`
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
`;document.body.appendChild(g);g.querySelectorAll(".zone-color-chip").forEach(e=>{e.addEventListener("click",()=>{A=parseInt(e.dataset.colorIndex),g.querySelectorAll(".zone-color-chip").forEach(t=>{t.style.outline="none",t.style.transform="scale(1)"}),e.style.outline="2px solid #374151",e.style.outlineOffset="2px",e.style.transform="scale(1.2)"})});document.getElementById("zone-edit-cancel").addEventListener("click",()=>{g.style.display="none"});document.getElementById("zone-edit-save").addEventListener("click",()=>{const e=document.getElementById("zone-edit-label").value.trim();if(!e)return;const t=ie[A];fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_type:"zone",item_id:parseInt(h.dataset.zoneId),on_board:!0,pos_x:parseFloat(h.style.left)||0,pos_y:parseFloat(h.style.top)||0,meta:{color_index:A,label:e,width:parseFloat(h.style.width)||h.offsetWidth,height:parseFloat(h.style.height)||h.offsetHeight}})}),h.style.borderColor=t.border,h.style.background=t.bg,h.dataset.colorIndex=A,h.dataset.label=e;const o=h.querySelector(".zone-label-text");o&&(o.textContent=e,o.style.color=t.text),g.style.display="none"});document.getElementById("zone-edit-delete").addEventListener("click",()=>{confirm("このグループを削除しますか？")&&fetch("/board/zone/"+h.dataset.zoneId,{method:"DELETE",headers:{"X-CSRF-TOKEN":d}}).then(e=>e.json()).then(()=>{h.remove(),g.style.display="none"})});function Xo(e){h=e,A=parseInt(e.dataset.colorIndex??0),document.getElementById("zone-edit-label").value=e.dataset.label??"",g.querySelectorAll(".zone-color-chip").forEach(t=>{const o=parseInt(t.dataset.colorIndex)===A;t.style.outline=o?"2px solid #374151":"none",t.style.outlineOffset="2px",t.style.transform=o?"scale(1.2)":"scale(1)"}),g.style.display="flex"}function Fo(){const e=document.getElementById("newZoneLabel").value.trim();e&&fetch("/board/zone",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,label:e,color_index:0})}).then(t=>t.json()).then(t=>{const o=t.item,n=Re(o);document.getElementById("board-canvas").appendChild(n),ae(n),document.getElementById("newZoneLabel").value=""})}function Re(e){const t=e.meta??{},o=ie[t.color_index??0],n=document.createElement("div");return n.className="zone magnet-zone cursor-grab select-none absolute border-2 rounded-xl",n.dataset.zoneId=e.whiteboard_item_id,n.dataset.colorIndex=t.color_index??0,n.dataset.label=t.label??"",n.style.cssText=`
        left:${e.pos_x??40}px;top:${e.pos_y??40}px;
        width:${t.width??180}px;height:${t.height??280}px;
        border-color:${o.border};background:${o.bg};
    `,n.innerHTML=Ao(t.label??"",o),n}function Ao(e,t){return`
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
    `}function Po(e){fetch("/board/zone",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,label:e.dataset.label,color_index:parseInt(e.dataset.colorIndex??0)})}).then(t=>t.json()).then(t=>{const o=t.item;j!==e&&(w(0),K(e)),w(u+20);const n=(parseFloat(e.style.left)||0)+u,i=(parseFloat(e.style.top)||0)+u;o.pos_x=n,o.pos_y=i,o.meta.width=e.offsetWidth,o.meta.height=e.offsetHeight;const s=Re(o);s.querySelectorAll(".zone-edit-btn, .zone-copy-btn").forEach(a=>a.style.display="none"),s.querySelectorAll(".zone-resize-handle").forEach(a=>a.style.display="none"),document.getElementById("board-canvas").appendChild(s),ae(s),fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_type:"zone",item_id:parseInt(o.whiteboard_item_id),on_board:!0,pos_x:n,pos_y:i,meta:o.meta})})})}function No(e){if(document.querySelector(`.magnet-zone[data-zone-id="${e.whiteboard_item_id}"]`))return;const t=Re(e);document.getElementById("board-canvas").appendChild(t),ae(t)}function jo(e){const t=document.querySelector(`.magnet-zone[data-zone-id="${e.zoneId}"]`);t&&t.remove()}function Yo(e){var o,n,i,s;const t=document.querySelector(`.magnet-zone[data-zone-id="${e.itemId}"]`);if(t){if(t.style.left=e.posX+"px",t.style.top=e.posY+"px",(o=e.meta)!=null&&o.width&&(t.style.width=e.meta.width+"px"),(n=e.meta)!=null&&n.height&&(t.style.height=e.meta.height+"px"),((i=e.meta)==null?void 0:i.colorIndex)!==void 0){const a=ie[e.meta.colorIndex];t.style.borderColor=a.border,t.style.background=a.bg}if((s=e.meta)!=null&&s.label){const a=t.querySelector(".zone-label-text");a&&(a.textContent=e.meta.label)}}}function Xe(e){const t=e.meta??{},o=document.createElement("div");return o.className="text-box absolute cursor-grab select-none",o.dataset.textId=e.whiteboard_item_id,o.style.cssText=`
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
    `,o}function re(e){e.addEventListener("mousedown",s=>at(s,e)),e.addEventListener("touchstart",s=>at(s,e),{passive:!1}),e.addEventListener("mouseenter",()=>{e.querySelector(".text-edit-btn").style.display="flex",e.querySelector(".text-delete-btn").style.display="block",e.querySelector(".text-copy-btn").style.display="block",e.querySelector(".text-resize-handle").style.display="block";const s=e.querySelector(".text-box-inner");s.contentEditable!=="true"&&(s.style.borderColor="#d1d5db")}),e.addEventListener("mouseleave",()=>{e.querySelector(".text-edit-btn").style.display="none",e.querySelector(".text-delete-btn").style.display="none",e.querySelector(".text-copy-btn").style.display="none",e.querySelector(".text-resize-handle").style.display="none";const s=e.querySelector(".text-box-inner");s.contentEditable!=="true"&&(s.style.borderColor="transparent")}),e.querySelector(".text-box-inner").addEventListener("dblclick",s=>{s.stopPropagation(),st(e)});const t=e.querySelector(".text-edit-btn");t.addEventListener("mousedown",s=>s.stopPropagation()),t.addEventListener("click",s=>{s.stopPropagation(),st(e)});const o=e.querySelector(".text-delete-btn");o.addEventListener("mousedown",s=>s.stopPropagation()),o.addEventListener("click",s=>{s.stopPropagation(),confirm("このテキストを削除しますか？")&&fetch("/board/text/"+e.dataset.textId,{method:"DELETE",headers:{"X-CSRF-TOKEN":d}}).then(a=>a.json()).then(()=>e.remove())});const n=e.querySelector(".text-copy-btn");n.addEventListener("mousedown",s=>s.stopPropagation()),n.addEventListener("click",s=>{s.stopPropagation(),Ko(e)});const i=e.querySelector(".text-resize-handle");i.addEventListener("mousedown",s=>rt(s,e)),i.addEventListener("touchstart",s=>rt(s,e),{passive:!1})}function st(e){const t=e.querySelector(".text-box-inner"),o=t.textContent,n=t.style.backgroundColor||"transparent";t.contentEditable="true",t.style.cursor="text",t.style.borderColor="transparent",t.focus();const i=document.createRange();i.selectNodeContents(t),i.collapse(!1);const s=window.getSelection();s.removeAllRanges(),s.addRange(i);const a=document.createElement("div");a.className="text-toolbar",a.style.cssText=`
        position:absolute;bottom:-36px;left:0;
        display:flex;align-items:center;gap:4px;
        background:white;border:1px solid #d1d5db;border-radius:6px;
        padding:4px 6px;z-index:20;box-shadow:0 2px 6px rgba(0,0,0,0.1);
    `;const b=parseInt(t.style.fontSize)||14,Y=t.style.color||"#374151",O=t.style.fontWeight==="700"||t.style.fontWeight==="bold",B=t.style.fontFamily||"'Kosugi Maru', sans-serif";a.innerHTML=`
        <select class="tb-font" style="font-size:11px;border:1px solid #e5e7eb;border-radius:4px;padding:2px 4px;width:140px;">
            <option value="'Kosugi Maru', sans-serif" style="font-family:'Kosugi Maru',sans-serif" ${B.includes("Kosugi Maru")?"selected":""}>Kosugi Maru</option>
            <option value="'Sawarabi Mincho', serif" style="font-family:'Sawarabi Mincho',serif" ${B.includes("Sawarabi Mincho")?"selected":""}>Sawarabi Mincho</option>
            <option value="'Zen Maru Gothic', sans-serif" style="font-family:'Zen Maru Gothic',sans-serif" ${B.includes("Zen Maru Gothic")?"selected":""}>Zen Maru Gothic</option>
            <option value="'Kiwi Maru', serif" style="font-family:'Kiwi Maru',serif" ${B.includes("Kiwi Maru")?"selected":""}>Kiwi Maru</option>
            <option value="'Hachi Maru Pop', cursive" style="font-family:'Hachi Maru Pop',cursive" ${B.includes("Hachi Maru Pop")?"selected":""}>Hachi Maru Pop</option>
            <option value="'Potta One', cursive" style="font-family:'Potta One',cursive" ${B.includes("Potta One")?"selected":""}>Potta One</option>
        </select>
        <select class="tb-size" style="font-size:11px;border:1px solid #e5e7eb;border-radius:4px;padding:2px 4px;">
            ${[10,12,14,16,18,20,24,28,32,40].map(r=>`<option value="${r}" ${r===b?"selected":""}>${r}px</option>`).join("")}
        </select>
        <div class="tb-color-wrap" style="position:relative;">
            <button class="tb-color-btn" title="文字色" style="
                width:24px;height:24px;border:1px solid #e5e7eb;border-radius:4px;
                cursor:pointer;font-size:14px;font-weight:700;line-height:24px;
                text-align:center;background:white;color:${Y};">A</button>
            <div class="tb-color-palette" style="
                display:none;position:absolute;top:-112px;left:0;
                background:white;border:1px solid #d1d5db;border-radius:6px;
                padding:4px;box-shadow:0 2px 6px rgba(0,0,0,0.15);z-index:30;">
                <div style="display:flex;flex-wrap:wrap;gap:3px;width:${10*23}px;">
                    ${G.map(r=>`
                        <div class="tb-color-chip" data-color="${r}" style="
                            width:20px;height:20px;border-radius:4px;cursor:pointer;
                            background:${r};border:1.5px solid ${r==="#ffffff"?"#d1d5db":r};
                        "></div>
                    `).join("")}
                </div>
            </div>
        </div>
        <div class="tb-bg-wrap" style="position:relative;">
            <button class="tb-bg-btn" title="背景色" style="
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
                    ${G.map(r=>`
                        <div class="tb-bg-chip" data-color="${r}" style="
                            width:20px;height:20px;border-radius:4px;cursor:pointer;
                            background:${r};border:1.5px solid ${r==="#ffffff"?"#d1d5db":r};
                        "></div>
                    `).join("")}
                </div>
            </div>
        </div>
        <button class="tb-bold" style="
            font-size:12px;font-weight:700;width:24px;height:24px;
            border:1px solid ${O?"#374151":"#e5e7eb"};
            border-radius:4px;cursor:pointer;
            background:${O?"#f3f4f6":"transparent"};
            color:#374151;">B</button>
        <button class="tb-align" data-align="left" title="左寄せ" style="
            width:24px;height:24px;border:1px solid #e5e7eb;border-radius:4px;
            cursor:pointer;background:white;display:flex;align-items:center;justify-content:center;
        "><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#374151" stroke-width="1.5" stroke-linecap="round">
            <line x1="1" y1="3" x2="13" y2="3"/><line x1="1" y1="7" x2="9" y2="7"/><line x1="1" y1="11" x2="11" y2="11"/>
        </svg></button>
        <button class="tb-align" data-align="center" title="中央" style="
            width:24px;height:24px;border:1px solid #e5e7eb;border-radius:4px;
            cursor:pointer;background:white;display:flex;align-items:center;justify-content:center;
        "><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#374151" stroke-width="1.5" stroke-linecap="round">
            <line x1="1" y1="3" x2="13" y2="3"/><line x1="3" y1="7" x2="11" y2="7"/><line x1="2" y1="11" x2="12" y2="11"/>
        </svg></button>
        <button class="tb-align" data-align="right" title="右寄せ" style="
            width:24px;height:24px;border:1px solid #e5e7eb;border-radius:4px;
            cursor:pointer;background:white;display:flex;align-items:center;justify-content:center;
        "><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#374151" stroke-width="1.5" stroke-linecap="round">
            <line x1="1" y1="3" x2="13" y2="3"/><line x1="5" y1="7" x2="13" y2="7"/><line x1="3" y1="11" x2="13" y2="11"/>
        </svg></button>
    `,e.appendChild(a),a.addEventListener("mousedown",r=>{r.stopPropagation(),r.target.closest("select")||r.preventDefault()}),a.querySelector(".tb-font").addEventListener("change",r=>{t.style.fontFamily=r.target.value}),a.querySelector(".tb-size").addEventListener("change",r=>{t.style.fontSize=r.target.value+"px"}),a.querySelector(".tb-bold").addEventListener("click",r=>{const R=t.style.fontWeight==="700";t.style.fontWeight=R?"400":"700",r.target.style.borderColor=R?"#e5e7eb":"#374151",r.target.style.background=R?"transparent":"#f3f4f6"}),a.querySelectorAll(".tb-align").forEach(r=>{r.dataset.align===(t.style.textAlign||"left")&&(r.style.borderColor="#374151",r.style.background="#f3f4f6"),r.addEventListener("click",()=>{t.style.textAlign=r.dataset.align,a.querySelectorAll(".tb-align").forEach(R=>{R.style.borderColor="#e5e7eb",R.style.background="transparent"}),r.style.borderColor="#374151",r.style.background="#f3f4f6"})});const Qe=a.querySelector(".tb-color-btn"),W=a.querySelector(".tb-color-palette");Qe.addEventListener("click",()=>{W.style.display=W.style.display==="none"?"block":"none",a.querySelector(".tb-bg-palette").style.display="none"}),a.querySelectorAll(".tb-color-chip").forEach(r=>{r.addEventListener("click",()=>{t.style.color=r.dataset.color,Qe.style.color=r.dataset.color,W.style.display="none",t.focus()})});const et=a.querySelector(".tb-bg-btn"),pe=a.querySelector(".tb-bg-palette");et.addEventListener("click",()=>{pe.style.display=pe.style.display==="none"?"block":"none",W.style.display="none"}),a.querySelectorAll(".tb-bg-chip").forEach(r=>{r.addEventListener("click",()=>{t.style.backgroundColor=r.dataset.color,t.dataset.bgColor=r.dataset.color,et.style.backgroundColor=r.dataset.color,pe.style.display="none",t.focus()})});function Co(){t.removeEventListener("blur",ue),t.contentEditable="false",t.style.cursor="inherit",t.style.borderColor="transparent",a.remove(),fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_type:"text",item_id:parseInt(e.dataset.textId),on_board:!0,pos_x:parseFloat(e.style.left)||0,pos_y:parseFloat(e.style.top)||0,meta:{text:t.innerText.trim(),font_size:parseInt(t.style.fontSize)||14,color:t.style.color||"#374151",font_weight:t.style.fontWeight||"400",font_family:(t.style.fontFamily||"'Kosugi Maru', sans-serif").replace(/"/g,"'"),text_align:t.style.textAlign||"left",bg_color:t.dataset.bgColor||"transparent",width:e.offsetWidth,height:e.offsetHeight}})})}function ue(r){if(a.contains(r.relatedTarget)){t.focus();return}t.style.borderColor="transparent",setTimeout(()=>{t.contentEditable==="true"&&Co()},50)}t.addEventListener("blur",ue),t.addEventListener("keydown",r=>{r.key==="Escape"&&(t.removeEventListener("blur",ue),t.textContent=o,t.contentEditable="false",t.style.cursor="inherit",t.style.borderColor="transparent",a.remove())})}let be=null,q=null,Fe=0,Ae=0,ee=null,xe=0,ge=0;function at(e,t){if(e.target.classList.contains("text-edit-btn")||e.target.classList.contains("text-delete-btn")||e.target.classList.contains("text-copy-btn")||e.target.classList.contains("text-resize-handle")||e.target.contentEditable==="true")return;const o=e.touches?e.touches[0].clientX:e.clientX,n=e.touches?e.touches[0].clientY:e.clientY;ee=t,xe=o,ge=n,document.addEventListener("mousemove",Pe),document.addEventListener("mouseup",Ne)}function Pe(e){const t=e.clientX-xe,o=e.clientY-ge;(Math.abs(t)>4||Math.abs(o)>4)&&(document.removeEventListener("mousemove",Pe),document.removeEventListener("mouseup",Ne),Do(ee,xe,ge),ee=null)}function Ne(){document.removeEventListener("mousemove",Pe),document.removeEventListener("mouseup",Ne),ee=null}function Do(e,t,o){be=e;const n=e.getBoundingClientRect();Fe=t-n.left,Ae=o-n.top,q=e.cloneNode(!0),q.style.cssText+=`position:fixed;pointer-events:none;z-index:9998;opacity:0.7;
        left:${n.left}px;top:${n.top}px;width:${n.width}px;`,document.body.appendChild(q),e.style.opacity="0.3",document.addEventListener("mousemove",Wt),document.addEventListener("mouseup",Zt)}function Wt(e){q.style.left=e.clientX-Fe+"px",q.style.top=e.clientY-Ae+"px"}function Zt(e){document.removeEventListener("mousemove",Wt),document.removeEventListener("mouseup",Zt),q.remove(),q=null;const t=l.getBoundingClientRect(),o=be;let n=e.clientX-t.left+l.scrollLeft-Fe,i=e.clientY-t.top+l.scrollTop-Ae;n=Math.max(0,Math.min(n,P-o.offsetWidth)),i=Math.max(0,Math.min(i,N-o.offsetHeight)),o.style.left=n+"px",o.style.top=i+"px",o.style.opacity="1",be=null;const s=o.querySelector(".text-box-inner");fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_type:"text",item_id:parseInt(o.dataset.textId),on_board:!0,pos_x:n,pos_y:i,meta:{text:s.innerText,font_size:parseInt(s.style.fontSize)||14,color:s.style.color||"#374151",font_weight:s.style.fontWeight||"400",font_family:(s.style.fontFamily||"'Kosugi Maru', sans-serif").replace(/"/g,"'"),text_align:s.style.textAlign||"left",bg_color:s.dataset.bgColor||"transparent",width:o.offsetWidth,height:o.offsetHeight}})})}let y=null,Jt=0,Ut=0,Gt=0,Vt=0;function rt(e,t){e.stopPropagation(),e.preventDefault(),y=t,Jt=e.touches?e.touches[0].clientX:e.clientX,Ut=e.touches?e.touches[0].clientY:e.clientY,Gt=t.offsetWidth,Vt=t.offsetHeight,document.addEventListener("mousemove",Qt),document.addEventListener("mouseup",eo)}function Qt(e){if(!y)return;y.style.width=Math.max(100,Gt+(e.clientX-Jt))+"px",y.style.height=Math.max(50,Vt+(e.clientY-Ut))+"px";const t=y.querySelector(".text-box-inner");t&&(t.style.minHeight=y.style.height)}function eo(){if(document.removeEventListener("mousemove",Qt),document.removeEventListener("mouseup",eo),!y)return;const e=y.querySelector(".text-box-inner");fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_type:"text",item_id:parseInt(y.dataset.textId),on_board:!0,pos_x:parseFloat(y.style.left)||0,pos_y:parseFloat(y.style.top)||0,meta:{text:e.innerText,font_size:parseInt(e.style.fontSize)||14,color:e.style.color||"#374151",font_weight:e.style.fontWeight||"400",font_family:(e.style.fontFamily||"'Kosugi Maru', sans-serif").replace(/"/g,"'"),text_align:e.style.textAlign||"left",bg_color:e.dataset.bgColor||"transparent",width:y.offsetWidth,height:y.offsetHeight}})}),y=null}function Ho(){fetch("/board/text",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,text:"テキスト"})}).then(e=>e.json()).then(e=>{const t=Xe(e.item);document.getElementById("board-canvas").appendChild(t),re(t)})}function Ko(e){const t=e.querySelector(".text-box-inner");fetch("/board/text",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,text:t.innerText.trim()})}).then(o=>o.json()).then(o=>{const n=o.item;n.meta={...n.meta,font_size:parseInt(t.style.fontSize)||14,color:t.style.color||"#374151",font_weight:t.style.fontWeight||"400",font_family:(t.style.fontFamily||"'Kosugi Maru', sans-serif").replace(/"/g,"'"),text_align:t.style.textAlign||"left",bg_color:t.dataset.bgColor||"transparent",width:e.offsetWidth,height:e.offsetHeight},j!==e&&(w(0),K(e)),w(u+20),n.pos_x=(parseFloat(e.style.left)||0)+u,n.pos_y=(parseFloat(e.style.top)||0)+u;const i=Xe(n);i.querySelectorAll(".text-edit-btn, .text-copy-btn, .text-delete-btn").forEach(s=>s.style.display="none"),i.querySelectorAll(".text-resize-handle").forEach(s=>s.style.display="none"),document.getElementById("board-canvas").appendChild(i),re(i),fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_type:"text",item_id:parseInt(n.whiteboard_item_id),on_board:!0,pos_x:n.pos_x,pos_y:n.pos_y,meta:n.meta})})})}function Wo(e){setTimeout(()=>{if(document.querySelector(`.text-box[data-text-id="${e.whiteboard_item_id}"]`))return;const t=Xe(e);document.getElementById("board-canvas").appendChild(t),re(t)},100)}function Zo(e){const t=document.querySelector(`.text-box[data-text-id="${e.itemId}"]`);t&&t.remove()}function Jo(e){var o,n;const t=document.querySelector(`.text-box[data-text-id="${e.itemId}"]`);t&&(t.style.left=e.posX+"px",t.style.top=e.posY+"px",(o=e.meta)!=null&&o.width&&(t.style.width=e.meta.width+"px"),(n=e.meta)!=null&&n.height&&(t.style.height=e.meta.height+"px"))}function je(e,t,o,n){switch(e){case"rect":return`<rect x="2" y="2" width="96" height="96"
                fill="${t}" stroke="${o}" stroke-width="2" rx="4"
                vector-effect="non-scaling-stroke"/>`;case"circle":return`<ellipse cx="50" cy="50" rx="48" ry="48"
                fill="${t}" stroke="${o}" stroke-width="2"
                vector-effect="non-scaling-stroke"/>`;case"triangle":return`<polygon points="50,2 98,98 2,98"
                fill="${t}" stroke="${o}" stroke-width="2"
                vector-effect="non-scaling-stroke"/>`;case"line":return`<line x1="0" y1="50" x2="100" y2="50"
                stroke="${o}" stroke-width="3"
                vector-effect="non-scaling-stroke"/>`;case"arrow":return`
                <defs>
                    <marker id="arrow-${n}" markerWidth="10" markerHeight="7"
                            refX="10" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="${o}"/>
                    </marker>
                </defs>
                <line x1="0" y1="50" x2="90" y2="50"
                    stroke="${o}" stroke-width="3"
                    vector-effect="non-scaling-stroke"
                    marker-end="url(#arrow-${n})"/>`;default:return""}}function Ye(e){const t=e.meta??{},o=t.shape_type??"rect",n=t.fill_color??"#93c5fd",i=t.stroke_color??"#2563eb",s=t.rotation??0,a=document.createElement("div");return a.className="shape-box absolute cursor-grab select-none",a.dataset.shapeId=e.whiteboard_item_id,a.dataset.shapeType=o,a.dataset.fillColor=n,a.dataset.strokeColor=i,a.dataset.rotation=s,a.style.cssText=`
        left:${e.pos_x}px;top:${e.pos_y}px;
        width:${t.width??120}px;height:${t.height??120}px;
        position:absolute;
        transform:rotate(${s}deg);
    `,a.innerHTML=`
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style="overflow:visible;">
            ${je(o,n,i,e.whiteboard_item_id)}
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
            width:14px;height:14px;border-radius:50%;background:#374151;
            cursor:grab;z-index:10;user-select:none;">↻</div>
    `,a}function de(e){e.addEventListener("mousedown",a=>dt(a,e)),e.addEventListener("touchstart",a=>dt(a,e),{passive:!1}),e.addEventListener("mouseenter",()=>{e.querySelector(".shape-delete-btn").style.display="block",e.querySelector(".shape-copy-btn").style.display="block",e.querySelector(".shape-color-btn").style.display="block",e.querySelector(".shape-resize-handle").style.display="block",e.querySelector(".shape-rotate-handle").style.display="block"}),e.addEventListener("mouseleave",a=>{a.relatedTarget&&a.relatedTarget.classList.contains("shape-rotate-handle")||(e.querySelector(".shape-delete-btn").style.display="none",e.querySelector(".shape-copy-btn").style.display="none",e.querySelector(".shape-color-btn").style.display="none",e.querySelector(".shape-resize-handle").style.display="none",e.querySelector(".shape-rotate-handle").style.display="none")});const t=e.querySelector(".shape-delete-btn");t.addEventListener("mousedown",a=>a.stopPropagation()),t.addEventListener("click",a=>{a.stopPropagation(),confirm("この図形を削除しますか？")&&fetch("/board/shape/"+e.dataset.shapeId,{method:"DELETE",headers:{"X-CSRF-TOKEN":d}}).then(b=>b.json()).then(()=>e.remove())});const o=e.querySelector(".shape-copy-btn");o.addEventListener("mousedown",a=>a.stopPropagation()),o.addEventListener("click",a=>{a.stopPropagation(),Qo(e)});const n=e.querySelector(".shape-color-btn");n.addEventListener("mousedown",a=>a.stopPropagation()),n.addEventListener("click",a=>{a.stopPropagation(),Vo(e)});const i=e.querySelector(".shape-resize-handle");i.addEventListener("mousedown",a=>lt(a,e)),i.addEventListener("touchstart",a=>lt(a,e),{passive:!1});const s=e.querySelector(".shape-rotate-handle");s.addEventListener("mouseleave",a=>{v||a.relatedTarget&&(a.relatedTarget===e||e.contains(a.relatedTarget))||(e.querySelector(".shape-delete-btn").style.display="none",e.querySelector(".shape-copy-btn").style.display="none",e.querySelector(".shape-color-btn").style.display="none",e.querySelector(".shape-resize-handle").style.display="none",s.style.display="none")}),s.addEventListener("mousedown",a=>Go(a,e))}let ve=null,$=null,De=0,He=0,te=null,Ee=0,Se=0;function dt(e,t){if(e.target.classList.contains("shape-delete-btn")||e.target.classList.contains("shape-copy-btn")||e.target.classList.contains("shape-color-btn")||e.target.classList.contains("shape-resize-handle")||e.target.classList.contains("shape-rotate-handle"))return;const o=e.touches?e.touches[0].clientX:e.clientX,n=e.touches?e.touches[0].clientY:e.clientY;te=t,Ee=o,Se=n,document.addEventListener("mousemove",Ke),document.addEventListener("mouseup",We)}function Ke(e){const t=e.clientX-Ee,o=e.clientY-Se;(Math.abs(t)>4||Math.abs(o)>4)&&(document.removeEventListener("mousemove",Ke),document.removeEventListener("mouseup",We),Uo(te,Ee,Se),te=null)}function We(){document.removeEventListener("mousemove",Ke),document.removeEventListener("mouseup",We),te=null}function Uo(e,t,o){ve=e;const n=e.getBoundingClientRect();De=t-n.left,He=o-n.top,$=e.cloneNode(!0),$.style.cssText+=`position:fixed;pointer-events:none;z-index:9998;opacity:0.7;
        left:${n.left}px;top:${n.top}px;width:${n.width}px;`,document.body.appendChild($),e.style.opacity="0.3",document.addEventListener("mousemove",to),document.addEventListener("mouseup",oo)}function to(e){$.style.left=e.clientX-De+"px",$.style.top=e.clientY-He+"px"}function oo(e){document.removeEventListener("mousemove",to),document.removeEventListener("mouseup",oo),$.remove(),$=null;const t=l.getBoundingClientRect(),o=ve;let n=e.clientX-t.left+l.scrollLeft-De,i=e.clientY-t.top+l.scrollTop-He;n=Math.max(0,Math.min(n,P-o.offsetWidth)),i=Math.max(0,Math.min(i,N-o.offsetHeight)),o.style.left=n+"px",o.style.top=i+"px",o.style.opacity="1",ve=null,le(o,n,i)}function le(e,t,o){fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_type:"shape",item_id:parseInt(e.dataset.shapeId),on_board:!0,pos_x:t,pos_y:o,meta:{shape_type:e.dataset.shapeType,fill_color:e.dataset.fillColor,stroke_color:e.dataset.strokeColor,rotation:parseInt(e.dataset.rotation)||0,width:e.offsetWidth,height:e.offsetHeight}})})}let _=null,no=0,io=0,so=0,ao=0;function lt(e,t){e.stopPropagation(),e.preventDefault(),_=t,no=e.touches?e.touches[0].clientX:e.clientX,io=e.touches?e.touches[0].clientY:e.clientY,so=t.offsetWidth,ao=t.offsetHeight,document.addEventListener("mousemove",ro),document.addEventListener("mouseup",lo)}function ro(e){_&&(_.style.width=Math.max(20,so+(e.clientX-no))+"px",_.style.height=Math.max(20,ao+(e.clientY-io))+"px")}function lo(){document.removeEventListener("mousemove",ro),document.removeEventListener("mouseup",lo),_&&(le(_,parseFloat(_.style.left)||0,parseFloat(_.style.top)||0),_=null)}let v=null,co=0,po=0;function Go(e,t){e.stopPropagation(),e.preventDefault(),v=t;const o=t.getBoundingClientRect();co=o.left+o.width/2,po=o.top+o.height/2,parseInt(t.dataset.rotation),document.addEventListener("mousemove",uo),document.addEventListener("mouseup",ho)}function uo(e){if(!v)return;const t=e.clientX-co,o=e.clientY-po,n=Math.round(Math.atan2(o,t)*(180/Math.PI)+90);v.style.transform=`rotate(${n}deg)`,v.dataset.rotation=n}function ho(){document.removeEventListener("mousemove",uo),document.removeEventListener("mouseup",ho),v&&(le(v,parseFloat(v.style.left)||0,parseFloat(v.style.top)||0),v=null)}const m=document.createElement("div");m.id="shape-color-modal";m.style.cssText=`
    display:none;position:fixed;inset:0;z-index:99999;
    background:rgba(0,0,0,0.4);
    align-items:center;justify-content:center;
`;m.innerHTML=`
    <div style="background:white;border-radius:12px;padding:24px;width:280px;">
        <p style="font-size:15px;font-weight:500;margin-bottom:16px;">色を変更</p>
        <div style="margin-bottom:16px;">
            <label style="font-size:12px;color:#6b7280;display:block;margin-bottom:6px;">塗りつぶし色</label>
            <div id="shape-fill-palette" style="display:flex;flex-wrap:wrap;gap:3px;width:${10*23}px;">
                ${G.map(e=>`
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
                ${G.map(e=>`
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
`;document.body.appendChild(m);let z=null;document.getElementById("shape-color-cancel").addEventListener("click",()=>{m.style.display="none"});let D="#93c5fd",H="#2563eb";m.querySelectorAll(".fill-chip").forEach(e=>{e.addEventListener("click",()=>{D=e.dataset.color,m.querySelectorAll(".fill-chip").forEach(t=>{t.style.outline="none",t.style.transform="scale(1)"}),e.style.outline="2px solid #374151",e.style.outlineOffset="2px",e.style.transform="scale(1.2)"})});m.querySelectorAll(".stroke-chip").forEach(e=>{e.addEventListener("click",()=>{H=e.dataset.color,m.querySelectorAll(".stroke-chip").forEach(t=>{t.style.outline="none",t.style.transform="scale(1)"}),e.style.outline="2px solid #374151",e.style.outlineOffset="2px",e.style.transform="scale(1.2)"})});document.getElementById("shape-color-save").addEventListener("click",()=>{z.dataset.fillColor=D,z.dataset.strokeColor=H;const e=z.querySelector("svg");e.innerHTML=je(z.dataset.shapeType,D,H,z.dataset.shapeId),le(z,parseFloat(z.style.left)||0,parseFloat(z.style.top)||0),m.style.display="none"});function Vo(e){z=e,D=e.dataset.fillColor||"#93c5fd",H=e.dataset.strokeColor||"#2563eb",m.querySelectorAll(".fill-chip").forEach(t=>{const o=t.dataset.color===D;t.style.outline=o?"2px solid #374151":"none",t.style.outlineOffset="2px",t.style.transform=o?"scale(1.2)":"scale(1)"}),m.querySelectorAll(".stroke-chip").forEach(t=>{const o=t.dataset.color===H;t.style.outline=o?"2px solid #374151":"none",t.style.outlineOffset="2px",t.style.transform=o?"scale(1.2)":"scale(1)"}),m.style.display="flex"}function Qo(e){fetch("/board/shape",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,shape_type:e.dataset.shapeType})}).then(t=>t.json()).then(t=>{const o=t.item;j!==e&&(w(0),K(e)),w(u+20);const n=(parseFloat(e.style.left)||0)+u,i=(parseFloat(e.style.top)||0)+u;o.pos_x=n,o.pos_y=i,o.meta={shape_type:e.dataset.shapeType,fill_color:e.dataset.fillColor,stroke_color:e.dataset.strokeColor,rotation:parseInt(e.dataset.rotation)||0,width:e.offsetWidth,height:e.offsetHeight};const s=Ye(o);s.querySelectorAll(".shape-delete-btn, .shape-copy-btn, .shape-color-btn").forEach(a=>a.style.display="none"),s.querySelectorAll(".shape-resize-handle, .shape-rotate-handle").forEach(a=>a.style.display="none"),document.getElementById("board-canvas").appendChild(s),de(s),fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_type:"shape",item_id:parseInt(o.whiteboard_item_id),on_board:!0,pos_x:n,pos_y:i,meta:o.meta})})})}function en(e){fetch("/board/shape",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,shape_type:e})}).then(t=>t.json()).then(t=>{const o=Ye(t.item);document.getElementById("board-canvas").appendChild(o),de(o)})}function tn(e){setTimeout(()=>{if(document.querySelector(`.shape-box[data-shape-id="${e.whiteboard_item_id}"]`))return;const t=Ye(e);document.getElementById("board-canvas").appendChild(t),de(t)},100)}function on(e){const t=document.querySelector(`.shape-box[data-shape-id="${e.itemId}"]`);t&&t.remove()}function nn(e){var o,n,i,s,a;const t=document.querySelector(`.shape-box[data-shape-id="${e.itemId}"]`);if(t&&(t.style.left=e.posX+"px",t.style.top=e.posY+"px",t.style.transform=`rotate(${((o=e.meta)==null?void 0:o.rotation)??0}deg)`,(n=e.meta)!=null&&n.width&&(t.style.width=e.meta.width+"px"),(i=e.meta)!=null&&i.height&&(t.style.height=e.meta.height+"px"),(s=e.meta)!=null&&s.fillColor||(a=e.meta)!=null&&a.strokeColor)){t.dataset.fillColor=e.meta.fillColor,t.dataset.strokeColor=e.meta.strokeColor;const b=t.querySelector("svg");b.innerHTML=je(t.dataset.shapeType,e.meta.fillColor,e.meta.strokeColor,e.itemId)}}function Ze(e){const t=e.meta??{},o=document.createElement("div");return o.className="image-box absolute cursor-grab select-none",o.dataset.imageId=e.whiteboard_item_id,o.style.cssText=`
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
    `,o}function ce(e){e.addEventListener("mousedown",i=>ct(i,e)),e.addEventListener("touchstart",i=>ct(i,e),{passive:!1}),e.addEventListener("mouseenter",()=>{e.querySelector(".image-delete-btn").style.display="block",e.querySelector(".image-copy-btn").style.display="block",e.querySelector(".image-resize-handle").style.display="block"}),e.addEventListener("mouseleave",()=>{e.querySelector(".image-delete-btn").style.display="none",e.querySelector(".image-copy-btn").style.display="none",e.querySelector(".image-resize-handle").style.display="none"});const t=e.querySelector(".image-delete-btn");t.addEventListener("mousedown",i=>i.stopPropagation()),t.addEventListener("click",i=>{i.stopPropagation(),confirm("この画像を削除しますか？")&&fetch("/board/image/"+e.dataset.imageId,{method:"DELETE",headers:{"X-CSRF-TOKEN":d}}).then(s=>s.json()).then(()=>e.remove())});const o=e.querySelector(".image-copy-btn");o.addEventListener("mousedown",i=>i.stopPropagation()),o.addEventListener("click",i=>{i.stopPropagation(),rn(e)});const n=e.querySelector(".image-resize-handle");n.addEventListener("mousedown",i=>pt(i,e)),n.addEventListener("touchstart",i=>pt(i,e),{passive:!1})}let we=null,M=null,Je=0,Ue=0,oe=null,ze=0,Le=0;function ct(e,t){if(e.target.classList.contains("image-delete-btn")||e.target.classList.contains("image-copy-btn")||e.target.classList.contains("image-resize-handle"))return;const o=e.touches?e.touches[0].clientX:e.clientX,n=e.touches?e.touches[0].clientY:e.clientY;oe=t,ze=o,Le=n,document.addEventListener("mousemove",Ge),document.addEventListener("mouseup",Ve)}function Ge(e){const t=e.clientX-ze,o=e.clientY-Le;(Math.abs(t)>4||Math.abs(o)>4)&&(document.removeEventListener("mousemove",Ge),document.removeEventListener("mouseup",Ve),sn(oe,ze,Le),oe=null)}function Ve(){document.removeEventListener("mousemove",Ge),document.removeEventListener("mouseup",Ve),oe=null}function sn(e,t,o){we=e;const n=e.getBoundingClientRect();Je=t-n.left,Ue=o-n.top,M=e.cloneNode(!0),M.style.cssText+=`position:fixed;pointer-events:none;z-index:9998;opacity:0.7;
        left:${n.left}px;top:${n.top}px;width:${n.width}px;height:${n.height}px;`,document.body.appendChild(M),e.style.opacity="0.3",document.addEventListener("mousemove",yo),document.addEventListener("mouseup",fo)}function yo(e){M.style.left=e.clientX-Je+"px",M.style.top=e.clientY-Ue+"px"}function fo(e){document.removeEventListener("mousemove",yo),document.removeEventListener("mouseup",fo),M.remove(),M=null;const t=l.getBoundingClientRect(),o=we;let n=e.clientX-t.left+l.scrollLeft-Je,i=e.clientY-t.top+l.scrollTop-Ue;n=Math.max(0,Math.min(n,P-o.offsetWidth)),i=Math.max(0,Math.min(i,N-o.offsetHeight)),o.style.left=n+"px",o.style.top=i+"px",o.style.opacity="1",we=null,mo(o,n,i)}function mo(e,t,o){const n=e.querySelector("img");fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_type:"image",item_id:parseInt(e.dataset.imageId),on_board:!0,pos_x:t,pos_y:o,meta:{src:n.src.replace(location.origin,""),width:e.offsetWidth,height:e.offsetHeight}})})}let C=null,bo=0,xo=0,go=0,vo=0;function pt(e,t){e.stopPropagation(),e.preventDefault(),C=t,bo=e.touches?e.touches[0].clientX:e.clientX,xo=e.touches?e.touches[0].clientY:e.clientY,go=t.offsetWidth,vo=t.offsetHeight,document.addEventListener("mousemove",Eo),document.addEventListener("mouseup",So)}function Eo(e){C&&(C.style.width=Math.max(40,go+(e.clientX-bo))+"px",C.style.height=Math.max(40,vo+(e.clientY-xo))+"px")}function So(){document.removeEventListener("mousemove",Eo),document.removeEventListener("mouseup",So),C&&(mo(C,parseFloat(C.style.left)||0,parseFloat(C.style.top)||0),C=null)}function an(){const e=document.createElement("input");e.type="file",e.accept="image/*",e.addEventListener("change",()=>{const t=e.files[0];if(!t)return;const o=new FormData;o.append("whiteboard_id",c),o.append("image",t),fetch("/board/image",{method:"POST",headers:{"X-CSRF-TOKEN":d},body:o}).then(n=>n.json()).then(n=>{const i=Ze(n.item);document.getElementById("board-canvas").appendChild(i),ce(i)})}),e.click()}function rn(e){const o=e.querySelector("img").src.replace(location.origin,"");fetch("/board/image/copy",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,src:o,width:e.offsetWidth,height:e.offsetHeight})}).then(n=>n.json()).then(n=>{const i=n.item;j!==e&&(w(0),K(e)),w(u+20),i.pos_x=(parseFloat(e.style.left)||0)+u,i.pos_y=(parseFloat(e.style.top)||0)+u;const s=Ze(i);s.querySelectorAll(".image-delete-btn, .image-copy-btn").forEach(a=>a.style.display="none"),s.querySelectorAll(".image-resize-handle").forEach(a=>a.style.display="none"),document.getElementById("board-canvas").appendChild(s),ce(s),fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_type:"image",item_id:parseInt(i.whiteboard_item_id),on_board:!0,pos_x:i.pos_x,pos_y:i.pos_y,meta:i.meta})})})}function dn(e){setTimeout(()=>{if(document.querySelector(`.image-box[data-image-id="${e.whiteboard_item_id}"]`))return;const t=Ze(e);document.getElementById("board-canvas").appendChild(t),ce(t)},100)}function ln(e){const t=document.querySelector(`.image-box[data-image-id="${e.itemId}"]`);t&&t.remove()}function cn(e){var o,n;const t=document.querySelector(`.image-box[data-image-id="${e.itemId}"]`);t&&(t.style.left=e.posX+"px",t.style.top=e.posY+"px",(o=e.meta)!=null&&o.width&&(t.style.width=e.meta.width+"px"),(n=e.meta)!=null&&n.height&&(t.style.height=e.meta.height+"px"))}window.addStaff=Io;window.addZone=Fo;window.addText=Ho;window.addShape=en;window.clearBoard=pn;window.addImage=an;document.querySelectorAll(".magnet").forEach(e=>se(e));document.querySelectorAll(".magnet-zone").forEach(e=>ae(e));document.querySelectorAll(".text-box").forEach(e=>re(e));document.querySelectorAll(".shape-box").forEach(e=>de(e));document.querySelectorAll(".image-box").forEach(e=>ce(e));let ne=!1,wo=0,zo=0,Lo=0,_o=0;l.addEventListener("mousedown",e=>{if(e.target===l||e.target.id==="board-canvas"||e.target.closest("#board-canvas")===document.getElementById("board-canvas")&&!e.target.closest(".magnet")&&!e.target.closest(".magnet-zone")&&!e.target.closest(".text-box")&&!e.target.closest(".shape-box")&&!e.target.closest(".image-box")){const t=document.querySelector('.text-box-inner[contenteditable="true"]');if(t){t.blur();return}ne=!0,wo=e.clientX,zo=e.clientY,Lo=l.scrollLeft,_o=l.scrollTop,l.style.cursor="grabbing",e.preventDefault()}});document.addEventListener("mousemove",e=>{ne&&(l.scrollLeft=Lo-(e.clientX-wo),l.scrollTop=_o-(e.clientY-zo))});document.addEventListener("mouseup",()=>{ne&&(ne=!1,l.style.cursor="default")});document.getElementById("board-canvas").addEventListener("mousedown",e=>{if(e.target.closest(".text-box"))return;const t=document.querySelector('.text-box-inner[contenteditable="true"]');t&&t.blur()});window.Echo.channel("whiteboard."+c).listen(".board.updated",e=>{switch(e.action){case"item.updated":e.payload.itemType==="staff"&&Bo(e.payload),e.payload.itemType==="zone"&&Yo(e.payload),e.payload.itemType==="text"&&Jo(e.payload),e.payload.itemType==="shape"&&nn(e.payload),e.payload.itemType==="image"&&cn(e.payload);break;case"staff.added":$o(e.payload);break;case"staff.deleted":Mo(e.payload);break;case"staff.updated":Oo(e.payload);break;case"zone.added":No(e.payload);break;case"zone.deleted":jo(e.payload);break;case"text.added":Wo(e.payload);break;case"text.deleted":Zo(e.payload);break;case"shape.added":tn(e.payload);break;case"shape.deleted":on(e.payload);break;case"image.added":dn(e.payload);break;case"image.deleted":ln(e.payload);break}});const Z=24,ut=120,J=document.getElementById("ruler-top-inner"),U=document.getElementById("ruler-left-inner");if(J&&U){for(let e=0;e<=P;e+=Z){const t=e%ut===0,o=document.createElement("div");if(o.style.cssText=`position:absolute;left:${e}px;bottom:0;width:1px;
            height:${t?6:3}px;background:${t?"#9ca3af":"#c8c6be"};`,J.appendChild(o),t){const n=document.createElement("div");n.style.cssText=`position:absolute;left:${e+2}px;top:3px;
                font-size:9px;color:#9ca3af;`,n.textContent=e/Z,J.appendChild(n)}}for(let e=0;e<=N;e+=Z){const t=e%ut===0,o=document.createElement("div");if(o.style.cssText=`position:absolute;top:${e}px;right:0;height:1px;
            width:${t?6:3}px;background:${t?"#9ca3af":"#c8c6be"};`,U.appendChild(o),t){const n=document.createElement("div");n.style.cssText=`position:absolute;top:${e+2}px;left:1px;
                font-size:9px;color:#9ca3af;`,n.textContent=e/Z,U.appendChild(n)}}l.addEventListener("scroll",()=>{J.style.transform=`translateX(-${l.scrollLeft}px)`,U.style.transform=`translateY(-${l.scrollTop}px)`})}function pn(){confirm(`ボード上の全ての要素を削除しますか？
この操作は元に戻せません。`)&&fetch("/board/clear",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c})}).then(e=>e.json()).then(()=>{document.querySelectorAll(".magnet").forEach(e=>e.remove()),document.querySelectorAll(".magnet-zone").forEach(e=>e.remove()),document.querySelectorAll(".text-box").forEach(e=>e.remove()),document.querySelectorAll(".shape-box").forEach(e=>e.remove()),document.querySelectorAll(".image-box").forEach(e=>e.remove())})}
