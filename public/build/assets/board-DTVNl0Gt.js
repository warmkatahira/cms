const l=document.getElementById("board");document.getElementById("tray");const c=parseInt(l.dataset.whiteboardId),j=parseInt(l.dataset.canvasW),H=parseInt(l.dataset.canvasH),d=document.querySelector('meta[name="csrf-token"]').content,k=[{bg:"#E6F1FB",border:"#378ADD",text:"#0C447C"},{bg:"#EAF3DE",border:"#639922",text:"#27500A"},{bg:"#FAEEDA",border:"#BA7517",text:"#633806"},{bg:"#FBEAF0",border:"#D4537E",text:"#72243E"},{bg:"#E1F5EE",border:"#1D9E75",text:"#085041"},{bg:"#EEEDFE",border:"#7F77DD",text:"#3C3489"},{bg:"#FAECE7",border:"#D85A30",text:"#711B13"},{bg:"#FEF9E7",border:"#D4AC0D",text:"#7D6608"},{bg:"#F2F3F4",border:"#717D7E",text:"#2C3E50"},{bg:"#FDEDEC",border:"#C0392B",text:"#7B241C"}],te=[{border:"#378ADD",bg:"rgba(56,138,221,0.06)",text:"#0C447C"},{border:"#639922",bg:"rgba(99,153,34,0.06)",text:"#27500A"},{border:"#D4537E",bg:"rgba(212,83,126,0.06)",text:"#72243E"},{border:"#BA7517",bg:"rgba(186,117,23,0.06)",text:"#633806"},{border:"#7F77DD",bg:"rgba(127,119,221,0.06)",text:"#3C3489"},{border:"#1D9E75",bg:"rgba(29,158,117,0.06)",text:"#085041"},{border:"#D85A30",bg:"rgba(216,90,48,0.06)",text:"#711B13"},{border:"#D4AC0D",bg:"rgba(212,172,13,0.06)",text:"#7D6608"},{border:"#717D7E",bg:"rgba(113,125,126,0.06)",text:"#2C3E50"},{border:"#C0392B",bg:"rgba(192,57,43,0.06)",text:"#7B241C"}],Z=["#374151","#ffffff","#dc2626","#ea580c","#ca8a04","#16a34a","#2563eb","#7c3aed","#ec4899","#000000","#6b7280","#b91c1c","#92400e","#854d0e","#065f46","#1e40af","#5b21b6","#9d174d","#0891b2","#fca5a5","#fdba74","#fde047","#86efac","#93c5fd","#c4b5fd","#f9a8d4","#67e8f9","#9ca3af","#e5e7eb"];let u=0,N=null;function w(e){u=e}function W(e){N=e}let x=null,E=null,we=0,ze=0,J=null,ce=0,pe=0;function oe(e){e.addEventListener("mousedown",i=>Ve(i,e)),e.addEventListener("touchstart",i=>Ve(i,e),{passive:!1}),e.addEventListener("mouseenter",()=>{const i=e.querySelector(".chip-edit-btn");i&&(i.style.display="flex");const a=e.querySelector(".chip-copy-btn");a&&(a.style.display="flex");const s=e.querySelector(".chip-resize-handle");s&&(s.style.display="block")}),e.addEventListener("mouseleave",()=>{const i=e.querySelector(".chip-edit-btn");i&&(i.style.display="none");const a=e.querySelector(".chip-copy-btn");a&&(a.style.display="none");const s=e.querySelector(".chip-resize-handle");s&&(s.style.display="none")});const t=e.querySelector(".chip-edit-btn");t&&(t.addEventListener("mousedown",i=>i.stopPropagation()),t.addEventListener("click",i=>{i.stopPropagation(),Lo(i,e)}));const o=e.querySelector(".chip-copy-btn");o&&(o.addEventListener("mousedown",i=>i.stopPropagation()),o.addEventListener("click",i=>{i.stopPropagation(),Co(e)}));const n=e.querySelector(".chip-resize-handle");n&&(n.addEventListener("mousedown",i=>Qe(i,e)),n.addEventListener("touchstart",i=>Qe(i,e),{passive:!1}))}function Ve(e,t){x&&(x.style.opacity="1",x=null),E&&(E.remove(),E=null);const o=e.touches?e.touches[0].clientX:e.clientX,n=e.touches?e.touches[0].clientY:e.clientY;J=t,ce=o,pe=n,document.addEventListener("mousemove",Le),document.addEventListener("mouseup",_e)}function Le(e){const t=e.clientX-ce,o=e.clientY-pe;(Math.abs(t)>4||Math.abs(o)>4)&&(document.removeEventListener("mousemove",Le),document.removeEventListener("mouseup",_e),zo(J,ce,pe),J=null)}function _e(){document.removeEventListener("mousemove",Le),document.removeEventListener("mouseup",_e),J=null}function zo(e,t,o){x=e;const n=e.getBoundingClientRect();we=t-n.left,ze=o-n.top,E=e.cloneNode(!0),E.style.cssText=`
        position:fixed;pointer-events:none;z-index:9999;opacity:0.85;
        left:${n.left}px;top:${n.top}px;
        transform:rotate(2deg) scale(1.05);
    `,document.body.appendChild(E),e.style.opacity="0.3",document.addEventListener("mousemove",lt),document.addEventListener("mouseup",ut),document.addEventListener("touchmove",ct,{passive:!1}),document.addEventListener("touchend",ht)}function lt(e){pt(e.clientX,e.clientY)}function ct(e){e.preventDefault(),pt(e.touches[0].clientX,e.touches[0].clientY)}function pt(e,t){E.style.left=e-we+"px",E.style.top=t-ze+"px"}function ut(e){yt(e.clientX,e.clientY)}function ht(e){yt(e.changedTouches[0].clientX,e.changedTouches[0].clientY)}function yt(e,t){document.removeEventListener("mousemove",lt),document.removeEventListener("mouseup",ut),document.removeEventListener("touchmove",ct),document.removeEventListener("touchend",ht),E.remove(),E=null;const o=l.getBoundingClientRect(),n=x.dataset.id;if(e>=o.left&&e<=o.right&&t>=o.top&&t<=o.bottom){let a=e-o.left+l.scrollLeft-we,s=t-o.top+l.scrollTop-ze;a=Math.max(0,Math.min(a,j-80)),s=Math.max(0,Math.min(s,H-50)),Ce(n,!0,a,s),x.style.position="absolute",x.style.left=a+"px",x.style.top=s+"px",document.getElementById("board-canvas").appendChild(x)}x.style.opacity="1",x=null}function Ce(e,t,o,n){const i=document.querySelector(`.magnet[data-id="${e}"]`),a=i?i.querySelector(".staff-chip-wrap > div"):null,s=a?{width:a.offsetWidth,height:a.offsetHeight}:null;fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_id:parseInt(e),on_board:t,pos_x:o,pos_y:n,meta:s})})}let L=null,ft=0,mt=0,bt=0,xt=0;function Qe(e,t){e.stopPropagation(),e.preventDefault(),L=t,ft=e.touches?e.touches[0].clientX:e.clientX,mt=e.touches?e.touches[0].clientY:e.clientY;const o=t.querySelector(".staff-chip-wrap > div");bt=o?o.offsetWidth:90,xt=o?o.offsetHeight:40,document.addEventListener("mousemove",gt),document.addEventListener("mouseup",St),document.addEventListener("touchmove",vt,{passive:!1}),document.addEventListener("touchend",wt)}function gt(e){Et(e.clientX,e.clientY)}function vt(e){e.preventDefault(),Et(e.touches[0].clientX,e.touches[0].clientY)}function Et(e,t){if(!L)return;const o=L.querySelector(".staff-chip-wrap > div");o&&(o.style.width=Math.max(50,bt+(e-ft))+"px",o.style.height=Math.max(50,xt+(t-mt))+"px")}function St(){zt()}function wt(){zt()}function zt(){if(document.removeEventListener("mousemove",gt),document.removeEventListener("mouseup",St),document.removeEventListener("touchmove",vt),document.removeEventListener("touchend",wt),!L)return;const e=L.querySelector(".staff-chip-wrap > div"),t=L.dataset.id;fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_id:parseInt(t),on_board:!0,pos_x:parseFloat(L.style.left)||0,pos_y:parseFloat(L.style.top)||0,meta:{width:e?e.offsetWidth:90,height:e?e.offsetHeight:40}})}),L=null}let Te=null,T=null,M=0,Lt="M",q="rect";const p=document.createElement("div");p.id="staff-edit-modal";p.style.cssText=`
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
                    ${k.map((e,t)=>`
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
`;document.body.appendChild(p);p.querySelectorAll(".modal-tab").forEach(e=>{e.addEventListener("click",()=>{p.querySelectorAll(".modal-tab").forEach(t=>{t.style.borderBottomColor="transparent",t.style.color="#9ca3af"}),e.style.borderBottomColor="#374151",e.style.color="#374151",document.getElementById("tab-basic").style.display=e.dataset.tab==="basic"?"block":"none",document.getElementById("tab-appearance").style.display=e.dataset.tab==="appearance"?"block":"none"})});p.querySelectorAll(".edit-color-chip").forEach(e=>{e.addEventListener("click",()=>{M=parseInt(e.dataset.color),p.querySelectorAll(".edit-color-chip").forEach(t=>{t.style.transform="scale(1)",t.style.outline="none"}),e.style.transform="scale(1.2)",e.style.outline="2px solid #374151",e.style.outlineOffset="2px"})});p.querySelectorAll(".edit-shape-chip").forEach(e=>{e.addEventListener("click",()=>{q=e.dataset.shape,p.querySelectorAll(".edit-shape-chip").forEach(t=>{t.style.borderColor="#d1d5db",t.style.background="white"}),e.style.borderColor="#374151",e.style.background="#f3f4f6"})});document.getElementById("edit-cancel").addEventListener("click",()=>{p.style.display="none"});function Lo(e,t){e.preventDefault(),Te=t.dataset.id,T=t;const o=p.querySelector('.modal-tab[data-tab="appearance"]');o&&(o.style.display="block"),document.getElementById("edit-name").value=t.dataset.name??"",document.getElementById("edit-role").value=t.dataset.role??"",M=parseInt(t.dataset.color??0)||0,Lt=t.dataset.size??"M",q=t.dataset.shape??"rect",p.querySelectorAll(".edit-color-chip").forEach(i=>{i.style.transform="scale(1)",i.style.outline="none"});const n=p.querySelector(`.edit-color-chip[data-color="${M}"]`);n&&(n.style.transform="scale(1.2)",n.style.outline="2px solid #374151",n.style.outlineOffset="2px"),p.querySelectorAll(".edit-shape-chip").forEach(i=>{const a=i.dataset.shape===q;i.style.borderColor=a?"#374151":"#d1d5db",i.style.background=a?"#f3f4f6":"white"}),document.getElementById("tab-basic").style.display="block",document.getElementById("tab-appearance").style.display="none",p.querySelectorAll(".modal-tab").forEach(i=>{const a=i.dataset.tab==="basic";i.style.borderBottomColor=a?"#374151":"transparent",i.style.color=a?"#374151":"#9ca3af"}),p.style.display="flex"}document.getElementById("edit-save").addEventListener("click",()=>{const e=document.getElementById("edit-name").value.trim(),t=document.getElementById("edit-role").value.trim();e&&fetch("/board/staff/"+Te,{method:"PATCH",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({staff_name:e,role_name:t,color:M,shape:q})}).then(o=>o.json()).then(()=>{const o=k[M],n=T.querySelector(".staff-chip-wrap"),i=n.querySelector("div"),a={rect:"border-radius:8px;clip-path:none;",circle:"border-radius:50%;clip-path:none;",sharp:"border-radius:0;clip-path:none;",rounded_bottom:"border-radius:0 0 50% 50%;clip-path:none;",tab:"border-radius:0 0 8px 8px;clip-path:none;"};i.style.cssText=`
            background:${o.bg};
            border:2px solid ${o.border};
            border-top:${q==="tab"?"4px":"2px"} solid ${o.border};
            width:${i.style.width||i.offsetWidth+"px"};
            height:${i.style.height||i.offsetHeight+"px"};
            padding:6px;text-align:center;
            ${a[q]??a.rect}
        `,T.dataset.shape=q,T.dataset.size=Lt,T.dataset.color=M,T.dataset.name=e,T.dataset.role=t;const s=n.querySelector('[data-field="name"]'),b=n.querySelector('[data-field="role"]');s&&(s.textContent=e,s.style.color=o.text),b&&(b.textContent=t,b.style.color=o.text),p.style.display="none"})});document.getElementById("edit-delete").addEventListener("click",()=>{confirm("このスタッフを削除しますか？")&&fetch("/board/staff/"+Te,{method:"DELETE",headers:{"X-CSRF-TOKEN":d}}).then(e=>e.json()).then(()=>{T.remove(),p.style.display="none"})});function _o(){const e=document.getElementById("newName").value.trim(),t=document.getElementById("newRole").value.trim();e&&fetch("/board/staff",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,staff_name:e,role_name:t})}).then(o=>o.json()).then(o=>{const n=o.staff,i=k[(n.color??0)%k.length],a=document.createElement("div");a.className="magnet absolute cursor-grab select-none",a.dataset.id=n.staff_id,a.dataset.color=n.color,a.dataset.name=n.staff_name,a.dataset.role=n.role_name??"",a.dataset.size=n.size??"M",a.dataset.shape=n.shape??"rect",a.style.left="40px",a.style.top="40px",a.innerHTML=_t(n.staff_name,n.role_name??"",i),oe(a),document.getElementById("board-canvas").appendChild(a),Ce(n.staff_id,!0,40,40),document.getElementById("newName").value="",document.getElementById("newRole").value=""})}function _t(e,t,o){return`
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
        </div>`}function Co(e){fetch("/board/staff",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,staff_name:e.dataset.name,role_name:e.dataset.role,color:parseInt(e.dataset.color)||0})}).then(t=>t.json()).then(t=>{const o=t.staff,n=document.createElement("div");n.className="magnet absolute cursor-grab select-none",n.dataset.id=o.staff_id,n.dataset.color=o.color,n.dataset.name=o.staff_name,n.dataset.role=o.role_name??"",n.dataset.size=e.dataset.size??"M",n.dataset.shape=e.dataset.shape??"rect",n.innerHTML=e.innerHTML,n.querySelectorAll(".chip-edit-btn, .chip-copy-btn").forEach(s=>s.style.display="none"),n.querySelectorAll(".chip-resize-handle").forEach(s=>s.style.display="none"),oe(n),N!==e&&(w(0),W(e)),w(u+20);const i=(parseFloat(e.style.left)||0)+u,a=(parseFloat(e.style.top)||0)+u;n.style.left=i+"px",n.style.top=a+"px",document.getElementById("board-canvas").appendChild(n),Ce(o.staff_id,!0,i,a)})}function To(e){setTimeout(()=>{if(document.querySelector(`.magnet[data-id="${e.staff_id}"]`))return;const t=k[(e.color??0)%k.length],o=document.createElement("div");o.className="magnet absolute cursor-grab select-none",o.dataset.id=e.staff_id,o.dataset.color=e.color??0,o.dataset.name=e.staff_name,o.dataset.role=e.role_name??"",o.dataset.shape=e.shape??"rect",o.style.left="40px",o.style.top="40px",o.innerHTML=_t(e.staff_name,e.role_name??"",t),oe(o),document.getElementById("board-canvas").appendChild(o)},100)}function ko(e){const t=document.querySelector(`.magnet[data-id="${e.staffId}"]`);t&&t.remove()}function qo(e){const t=document.querySelector(`.magnet[data-id="${e.staff_id}"]`);if(!t)return;const o=k[(e.color??0)%k.length],n=t.querySelector(".staff-chip-wrap"),i=n==null?void 0:n.querySelector("div");if(!i)return;const a=i.style.width||i.offsetWidth+"px",s=i.style.height||i.offsetHeight+"px",b={rect:"border-radius:8px;",circle:"border-radius:50%;",sharp:"border-radius:0;",rounded_bottom:"border-radius:0 0 50% 50%;",tab:"border-radius:0 0 8px 8px;"};i.style.cssText=`
        background:${o.bg};border:2px solid ${o.border};
        width:${a};height:${s};
        padding:6px;text-align:center;
        ${b[e.shape]??b.rect}
    `,t.dataset.name=e.staff_name,t.dataset.role=e.role_name??"",t.dataset.color=e.color??0,t.dataset.shape=e.shape??"rect";const P=n.querySelector('[data-field="name"]'),B=n.querySelector('[data-field="role"]');P&&(P.textContent=e.staff_name,P.style.color=o.text),B&&(B.textContent=e.role_name??"",B.style.color=o.text)}function Io(e){var o,n;const t=document.querySelector(`.magnet[data-id="${e.itemId}"]`);t&&e.onBoard&&(t.style.position="absolute",t.style.left=e.posX+"px",t.style.top=e.posY+"px",(o=e.meta)!=null&&o.width&&(t.querySelector(".staff-chip-wrap > div").style.width=e.meta.width+"px"),(n=e.meta)!=null&&n.height&&(t.querySelector(".staff-chip-wrap > div").style.height=e.meta.height+"px"),document.getElementById("board-canvas").appendChild(t))}let F=null,S=null,ke=0,qe=0,U=null,ue=0,he=0;function ne(e){e.addEventListener("mousedown",i=>et(i,e)),e.addEventListener("touchstart",i=>et(i,e),{passive:!1}),e.addEventListener("mouseenter",()=>{const i=e.querySelector(".zone-edit-btn");i&&(i.style.display="flex");const a=e.querySelector(".zone-copy-btn");a&&(a.style.display="flex");const s=e.querySelector(".zone-resize-handle");s&&(s.style.display="block")}),e.addEventListener("mouseleave",()=>{const i=e.querySelector(".zone-edit-btn");i&&(i.style.display="none");const a=e.querySelector(".zone-copy-btn");a&&(a.style.display="none");const s=e.querySelector(".zone-resize-handle");s&&(s.style.display="none")});const t=e.querySelector(".zone-edit-btn");t&&(t.addEventListener("mousedown",i=>i.stopPropagation()),t.addEventListener("click",i=>{i.stopPropagation(),Oo(e)}));const o=e.querySelector(".zone-copy-btn");o&&(o.addEventListener("mousedown",i=>i.stopPropagation()),o.addEventListener("click",i=>{i.stopPropagation(),Xo(e)}));const n=e.querySelector(".zone-resize-handle");n&&(n.addEventListener("mousedown",i=>tt(i,e)),n.addEventListener("touchstart",i=>tt(i,e),{passive:!1}))}function et(e,t){if(e.target.classList.contains("zone-edit-btn")||e.target.classList.contains("zone-copy-btn"))return;F&&(F.style.opacity="1",F=null),S&&(S.remove(),S=null);const o=e.touches?e.touches[0].clientX:e.clientX,n=e.touches?e.touches[0].clientY:e.clientY;U=t,ue=o,he=n,document.addEventListener("mousemove",Ie),document.addEventListener("mouseup",$e)}function Ie(e){const t=e.clientX-ue,o=e.clientY-he;(Math.abs(t)>4||Math.abs(o)>4)&&(document.removeEventListener("mousemove",Ie),document.removeEventListener("mouseup",$e),$o(U,ue,he),U=null)}function $e(){document.removeEventListener("mousemove",Ie),document.removeEventListener("mouseup",$e),U=null}function $o(e,t,o){F=e;const n=e.getBoundingClientRect();ke=t-n.left,qe=o-n.top,S=e.cloneNode(!0),S.style.cssText=`
        position:fixed;pointer-events:none;z-index:9998;opacity:0.7;
        left:${n.left}px;top:${n.top}px;
        width:${n.width}px;height:${n.height}px;
    `,document.body.appendChild(S),e.style.opacity="0.3",document.addEventListener("mousemove",Ct),document.addEventListener("mouseup",qt),document.addEventListener("touchmove",Tt,{passive:!1}),document.addEventListener("touchend",It)}function Ct(e){kt(e.clientX,e.clientY)}function Tt(e){e.preventDefault(),kt(e.touches[0].clientX,e.touches[0].clientY)}function kt(e,t){S.style.left=e-ke+"px",S.style.top=t-qe+"px"}function qt(e){$t(e.clientX,e.clientY)}function It(e){$t(e.changedTouches[0].clientX,e.changedTouches[0].clientY)}function $t(e,t){document.removeEventListener("mousemove",Ct),document.removeEventListener("mouseup",qt),document.removeEventListener("touchmove",Tt),document.removeEventListener("touchend",It),S.remove(),S=null;const o=l.getBoundingClientRect(),n=F,i=n.dataset.zoneId;let a=e-o.left+l.scrollLeft-ke,s=t-o.top+l.scrollTop-qe;a=Math.max(0,Math.min(a,j-n.offsetWidth)),s=Math.max(0,Math.min(s,H-n.offsetHeight)),n.style.left=a+"px",n.style.top=s+"px",n.style.opacity="1",F=null,fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_type:"zone",item_id:parseInt(i),on_board:!0,pos_x:a,pos_y:s,meta:{color_index:parseInt(n.dataset.colorIndex??0),label:n.dataset.label??"",width:n.offsetWidth,height:n.offsetHeight}})})}let f=null,Ot=0,Bt=0,Rt=0,Xt=0;function tt(e,t){e.stopPropagation(),e.preventDefault(),f=t,Ot=e.touches?e.touches[0].clientX:e.clientX,Bt=e.touches?e.touches[0].clientY:e.clientY,Rt=t.offsetWidth,Xt=t.offsetHeight,document.addEventListener("mousemove",Mt),document.addEventListener("mouseup",Nt),document.addEventListener("touchmove",Ft,{passive:!1}),document.addEventListener("touchend",Pt)}function Mt(e){At(e.clientX,e.clientY)}function Ft(e){e.preventDefault(),At(e.touches[0].clientX,e.touches[0].clientY)}function At(e,t){f&&(f.style.width=Math.max(100,Rt+(e-Ot))+"px",f.style.height=Math.max(80,Xt+(t-Bt))+"px")}function Nt(e){Yt()}function Pt(e){Yt()}function Yt(){document.removeEventListener("mousemove",Mt),document.removeEventListener("mouseup",Nt),document.removeEventListener("touchmove",Ft),document.removeEventListener("touchend",Pt),f&&(fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_type:"zone",item_id:parseInt(f.dataset.zoneId),on_board:!0,pos_x:parseFloat(f.style.left)||0,pos_y:parseFloat(f.style.top)||0,meta:{color_index:parseInt(f.dataset.colorIndex??0),label:f.dataset.label??"",width:f.offsetWidth,height:f.offsetHeight}})}),f=null)}let h=null,A=0;const g=document.createElement("div");g.id="zone-edit-modal";g.style.cssText=`
    display:none;position:fixed;inset:0;z-index:99999;
    background:rgba(0,0,0,0.4);
    align-items:center;justify-content:center;
`;g.innerHTML=`
    <div style="background:white;border-radius:12px;padding:24px;width:320px;">
        <p style="font-size:15px;font-weight:500;margin-bottom:16px;">グループを編集</p>
        <div style="margin-bottom:16px;">
            <label style="font-size:12px;color:#6b7280;display:block;margin-bottom:4px;">名称</label>
            <input id="zone-edit-label" type="text" autocomplete="off"
                   style="width:100%;font-size:14px;border:1px solid #d1d5db;border-radius:6px;padding:6px 10px;">
        </div>
        <div style="margin-bottom:20px;">
            <label style="font-size:12px;color:#6b7280;display:block;margin-bottom:8px;">色</label>
            <div style="display:flex;gap:8px;">
                ${te.map((e,t)=>`
                    <div class="zone-color-chip" data-color-index="${t}"
                         style="width:28px;height:28px;border-radius:50%;cursor:pointer;
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
`;document.body.appendChild(g);g.querySelectorAll(".zone-color-chip").forEach(e=>{e.addEventListener("click",()=>{A=parseInt(e.dataset.colorIndex),g.querySelectorAll(".zone-color-chip").forEach(t=>{t.style.outline="none",t.style.transform="scale(1)"}),e.style.outline="2px solid #374151",e.style.outlineOffset="2px",e.style.transform="scale(1.2)"})});document.getElementById("zone-edit-cancel").addEventListener("click",()=>{g.style.display="none"});document.getElementById("zone-edit-save").addEventListener("click",()=>{const e=document.getElementById("zone-edit-label").value.trim();if(!e)return;const t=te[A];fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_type:"zone",item_id:parseInt(h.dataset.zoneId),on_board:!0,pos_x:parseFloat(h.style.left)||0,pos_y:parseFloat(h.style.top)||0,meta:{color_index:A,label:e,width:parseFloat(h.style.width)||h.offsetWidth,height:parseFloat(h.style.height)||h.offsetHeight}})}),h.style.borderColor=t.border,h.style.background=t.bg,h.dataset.colorIndex=A,h.dataset.label=e;const o=h.querySelector(".zone-label-text");o&&(o.textContent=e,o.style.color=t.text),g.style.display="none"});document.getElementById("zone-edit-delete").addEventListener("click",()=>{confirm("このグループを削除しますか？")&&fetch("/board/zone/"+h.dataset.zoneId,{method:"DELETE",headers:{"X-CSRF-TOKEN":d}}).then(e=>e.json()).then(()=>{h.remove(),g.style.display="none"})});function Oo(e){h=e,A=parseInt(e.dataset.colorIndex??0),document.getElementById("zone-edit-label").value=e.dataset.label??"",g.querySelectorAll(".zone-color-chip").forEach(t=>{const o=parseInt(t.dataset.colorIndex)===A;t.style.outline=o?"2px solid #374151":"none",t.style.outlineOffset="2px",t.style.transform=o?"scale(1.2)":"scale(1)"}),g.style.display="flex"}function Bo(){const e=document.getElementById("newZoneLabel").value.trim();e&&fetch("/board/zone",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,label:e,color_index:0})}).then(t=>t.json()).then(t=>{const o=t.item,n=Oe(o);document.getElementById("board-canvas").appendChild(n),ne(n),document.getElementById("newZoneLabel").value=""})}function Oe(e){const t=e.meta??{},o=te[t.color_index??0],n=document.createElement("div");return n.className="zone magnet-zone cursor-grab select-none absolute border-2 rounded-xl",n.dataset.zoneId=e.whiteboard_item_id,n.dataset.colorIndex=t.color_index??0,n.dataset.label=t.label??"",n.style.cssText=`
        left:${e.pos_x??40}px;top:${e.pos_y??40}px;
        width:${t.width??180}px;height:${t.height??280}px;
        border-color:${o.border};background:${o.bg};
    `,n.innerHTML=Ro(t.label??"",o),n}function Ro(e,t){return`
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
    `}function Xo(e){fetch("/board/zone",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,label:e.dataset.label,color_index:parseInt(e.dataset.colorIndex??0)})}).then(t=>t.json()).then(t=>{const o=t.item;N!==e&&(w(0),W(e)),w(u+20);const n=(parseFloat(e.style.left)||0)+u,i=(parseFloat(e.style.top)||0)+u;o.pos_x=n,o.pos_y=i,o.meta.width=e.offsetWidth,o.meta.height=e.offsetHeight;const a=Oe(o);a.querySelectorAll(".zone-edit-btn, .zone-copy-btn").forEach(s=>s.style.display="none"),a.querySelectorAll(".zone-resize-handle").forEach(s=>s.style.display="none"),document.getElementById("board-canvas").appendChild(a),ne(a),fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_type:"zone",item_id:parseInt(o.whiteboard_item_id),on_board:!0,pos_x:n,pos_y:i,meta:o.meta})})})}function Mo(e){if(document.querySelector(`.magnet-zone[data-zone-id="${e.whiteboard_item_id}"]`))return;const t=Oe(e);document.getElementById("board-canvas").appendChild(t),ne(t)}function Fo(e){const t=document.querySelector(`.magnet-zone[data-zone-id="${e.zoneId}"]`);t&&t.remove()}function Ao(e){var o,n,i,a;const t=document.querySelector(`.magnet-zone[data-zone-id="${e.itemId}"]`);if(t){if(t.style.left=e.posX+"px",t.style.top=e.posY+"px",(o=e.meta)!=null&&o.width&&(t.style.width=e.meta.width+"px"),(n=e.meta)!=null&&n.height&&(t.style.height=e.meta.height+"px"),((i=e.meta)==null?void 0:i.colorIndex)!==void 0){const s=te[e.meta.colorIndex];t.style.borderColor=s.border,t.style.background=s.bg}if((a=e.meta)!=null&&a.label){const s=t.querySelector(".zone-label-text");s&&(s.textContent=e.meta.label)}}}function Be(e){const t=e.meta??{},o=document.createElement("div");return o.className="text-box absolute cursor-grab select-none",o.dataset.textId=e.whiteboard_item_id,o.style.cssText=`
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
    `,o}function ie(e){e.addEventListener("mousedown",a=>nt(a,e)),e.addEventListener("touchstart",a=>nt(a,e),{passive:!1}),e.addEventListener("mouseenter",()=>{e.querySelector(".text-edit-btn").style.display="flex",e.querySelector(".text-delete-btn").style.display="block",e.querySelector(".text-copy-btn").style.display="block",e.querySelector(".text-resize-handle").style.display="block";const a=e.querySelector(".text-box-inner");a.contentEditable!=="true"&&(a.style.borderColor="#d1d5db")}),e.addEventListener("mouseleave",()=>{e.querySelector(".text-edit-btn").style.display="none",e.querySelector(".text-delete-btn").style.display="none",e.querySelector(".text-copy-btn").style.display="none",e.querySelector(".text-resize-handle").style.display="none";const a=e.querySelector(".text-box-inner");a.contentEditable!=="true"&&(a.style.borderColor="transparent")}),e.querySelector(".text-box-inner").addEventListener("dblclick",a=>{a.stopPropagation(),ot(e)});const t=e.querySelector(".text-edit-btn");t.addEventListener("mousedown",a=>a.stopPropagation()),t.addEventListener("click",a=>{a.stopPropagation(),ot(e)});const o=e.querySelector(".text-delete-btn");o.addEventListener("mousedown",a=>a.stopPropagation()),o.addEventListener("click",a=>{a.stopPropagation(),confirm("このテキストを削除しますか？")&&fetch("/board/text/"+e.dataset.textId,{method:"DELETE",headers:{"X-CSRF-TOKEN":d}}).then(s=>s.json()).then(()=>e.remove())});const n=e.querySelector(".text-copy-btn");n.addEventListener("mousedown",a=>a.stopPropagation()),n.addEventListener("click",a=>{a.stopPropagation(),Yo(e)});const i=e.querySelector(".text-resize-handle");i.addEventListener("mousedown",a=>it(a,e)),i.addEventListener("touchstart",a=>it(a,e),{passive:!1})}function ot(e){const t=e.querySelector(".text-box-inner"),o=t.textContent,n=t.style.backgroundColor||"transparent";t.contentEditable="true",t.style.cursor="text",t.style.borderColor="transparent",t.focus();const i=document.createRange();i.selectNodeContents(t),i.collapse(!1);const a=window.getSelection();a.removeAllRanges(),a.addRange(i);const s=document.createElement("div");s.className="text-toolbar",s.style.cssText=`
        position:absolute;bottom:-36px;left:0;
        display:flex;align-items:center;gap:4px;
        background:white;border:1px solid #d1d5db;border-radius:6px;
        padding:4px 6px;z-index:20;box-shadow:0 2px 6px rgba(0,0,0,0.1);
    `;const b=parseInt(t.style.fontSize)||14,P=t.style.color||"#374151",B=t.style.fontWeight==="700"||t.style.fontWeight==="bold",R=t.style.fontFamily||"'Kosugi Maru', sans-serif";s.innerHTML=`
        <select class="tb-font" style="font-size:11px;border:1px solid #e5e7eb;border-radius:4px;padding:2px 4px;width:110px;">
            <option value="'Kosugi Maru', sans-serif" ${R.includes("Kosugi Maru")?"selected":""}>丸ゴシック</option>
            <option value="'Sawarabi Mincho', serif" ${R.includes("Sawarabi Mincho")?"selected":""}>明朝</option>
            <option value="'Zen Maru Gothic', sans-serif" ${R.includes("Zen Maru Gothic")?"selected":""}>丸ゴシック太</option>
            <option value="'Kiwi Maru', serif" ${R.includes("Kiwi Maru")?"selected":""}>丸明朝</option>
            <option value="'Hachi Maru Pop', cursive" ${R.includes("Hachi Maru Pop")?"selected":""}>手書き</option>
            <option value="'Potta One', cursive" ${R.includes("Potta One")?"selected":""}>ポップ</option>
        </select>
        <select class="tb-size" style="font-size:11px;border:1px solid #e5e7eb;border-radius:4px;padding:2px 4px;">
            ${[10,12,14,16,18,20,24,28,32,40].map(r=>`<option value="${r}" ${r===b?"selected":""}>${r}px</option>`).join("")}
        </select>
        <div class="tb-color-wrap" style="position:relative;">
            <button class="tb-color-btn" title="文字色" style="
                width:24px;height:24px;border:1px solid #e5e7eb;border-radius:4px;
                cursor:pointer;font-size:14px;font-weight:700;line-height:24px;
                text-align:center;background:white;color:${P};">A</button>
            <div class="tb-color-palette" style="
                display:none;position:absolute;top:-112px;left:0;
                background:white;border:1px solid #d1d5db;border-radius:6px;
                padding:4px;box-shadow:0 2px 6px rgba(0,0,0,0.15);z-index:30;">
                <div style="display:flex;flex-wrap:wrap;gap:3px;width:${10*23}px;">
                    ${Z.map(r=>`
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
                cursor:pointer;font-size:10px;line-height:24px;
                text-align:center;color:#374151;
                background-color:${n==="transparent"?"#ffffff":n};">塗</button>
            <div class="tb-bg-palette" style="
                display:none;position:absolute;top:-112px;left:0;
                background:white;border:1px solid #d1d5db;border-radius:6px;
                padding:4px;box-shadow:0 2px 6px rgba(0,0,0,0.15);z-index:30;">
                <div style="display:flex;flex-wrap:wrap;gap:3px;width:${10*23}px;">
                    ${Z.map(r=>`
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
            border:1px solid ${B?"#374151":"#e5e7eb"};
            border-radius:4px;cursor:pointer;
            background:${B?"#f3f4f6":"transparent"};
            color:#374151;">B</button>
        <button class="tb-align" data-align="left" title="左寄せ" style="
            font-size:12px;width:24px;height:24px;
            border:1px solid #e5e7eb;border-radius:4px;cursor:pointer;
            background:white;color:#374151;text-align:center;line-height:24px;
        ">≡</button>
        <button class="tb-align" data-align="center" title="中央" style="
            font-size:12px;width:24px;height:24px;
            border:1px solid #e5e7eb;border-radius:4px;cursor:pointer;
            background:white;color:#374151;text-align:center;line-height:24px;
        ">☰</button>
        <button class="tb-align" data-align="right" title="右寄せ" style="
            font-size:12px;width:24px;height:24px;
            border:1px solid #e5e7eb;border-radius:4px;cursor:pointer;
            background:white;color:#374151;text-align:center;line-height:24px;
        ">≣</button>
    `,e.appendChild(s),s.addEventListener("mousedown",r=>{r.stopPropagation(),r.target.closest("select")||r.preventDefault()}),s.querySelector(".tb-font").addEventListener("change",r=>{t.style.fontFamily=r.target.value}),s.querySelector(".tb-size").addEventListener("change",r=>{t.style.fontSize=r.target.value+"px"}),s.querySelector(".tb-bold").addEventListener("click",r=>{const X=t.style.fontWeight==="700";t.style.fontWeight=X?"400":"700",r.target.style.borderColor=X?"#e5e7eb":"#374151",r.target.style.background=X?"transparent":"#f3f4f6"}),s.querySelectorAll(".tb-align").forEach(r=>{r.dataset.align===(t.style.textAlign||"left")&&(r.style.borderColor="#374151",r.style.background="#f3f4f6"),r.addEventListener("click",()=>{t.style.textAlign=r.dataset.align,s.querySelectorAll(".tb-align").forEach(X=>{X.style.borderColor="#e5e7eb",X.style.background="transparent"}),r.style.borderColor="#374151",r.style.background="#f3f4f6"})});const Ue=s.querySelector(".tb-color-btn"),K=s.querySelector(".tb-color-palette");Ue.addEventListener("click",()=>{K.style.display=K.style.display==="none"?"block":"none",s.querySelector(".tb-bg-palette").style.display="none"}),s.querySelectorAll(".tb-color-chip").forEach(r=>{r.addEventListener("click",()=>{t.style.color=r.dataset.color,Ue.style.color=r.dataset.color,K.style.display="none",t.focus()})});const Ge=s.querySelector(".tb-bg-btn"),de=s.querySelector(".tb-bg-palette");Ge.addEventListener("click",()=>{de.style.display=de.style.display==="none"?"block":"none",K.style.display="none"}),s.querySelectorAll(".tb-bg-chip").forEach(r=>{r.addEventListener("click",()=>{t.style.backgroundColor=r.dataset.color,t.dataset.bgColor=r.dataset.color,Ge.style.backgroundColor=r.dataset.color,de.style.display="none",t.focus()})});function wo(){t.removeEventListener("blur",le),t.contentEditable="false",t.style.cursor="inherit",t.style.borderColor="transparent",s.remove(),fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_type:"text",item_id:parseInt(e.dataset.textId),on_board:!0,pos_x:parseFloat(e.style.left)||0,pos_y:parseFloat(e.style.top)||0,meta:{text:t.innerText.trim(),font_size:parseInt(t.style.fontSize)||14,color:t.style.color||"#374151",font_weight:t.style.fontWeight||"400",font_family:(t.style.fontFamily||"'Kosugi Maru', sans-serif").replace(/"/g,"'"),text_align:t.style.textAlign||"left",bg_color:t.dataset.bgColor||"transparent",width:e.offsetWidth,height:e.offsetHeight}})})}function le(r){if(s.contains(r.relatedTarget)){t.focus();return}t.style.borderColor="transparent",setTimeout(()=>{t.contentEditable==="true"&&wo()},50)}t.addEventListener("blur",le),t.addEventListener("keydown",r=>{r.key==="Escape"&&(t.removeEventListener("blur",le),t.textContent=o,t.contentEditable="false",t.style.cursor="inherit",t.style.borderColor="transparent",s.remove())})}let ye=null,I=null,Re=0,Xe=0,G=null,fe=0,me=0;function nt(e,t){if(e.target.classList.contains("text-edit-btn")||e.target.classList.contains("text-delete-btn")||e.target.classList.contains("text-copy-btn")||e.target.classList.contains("text-resize-handle")||e.target.contentEditable==="true")return;const o=e.touches?e.touches[0].clientX:e.clientX,n=e.touches?e.touches[0].clientY:e.clientY;G=t,fe=o,me=n,document.addEventListener("mousemove",Me),document.addEventListener("mouseup",Fe)}function Me(e){const t=e.clientX-fe,o=e.clientY-me;(Math.abs(t)>4||Math.abs(o)>4)&&(document.removeEventListener("mousemove",Me),document.removeEventListener("mouseup",Fe),No(G,fe,me),G=null)}function Fe(){document.removeEventListener("mousemove",Me),document.removeEventListener("mouseup",Fe),G=null}function No(e,t,o){ye=e;const n=e.getBoundingClientRect();Re=t-n.left,Xe=o-n.top,I=e.cloneNode(!0),I.style.cssText+=`position:fixed;pointer-events:none;z-index:9998;opacity:0.7;
        left:${n.left}px;top:${n.top}px;width:${n.width}px;`,document.body.appendChild(I),e.style.opacity="0.3",document.addEventListener("mousemove",Dt),document.addEventListener("mouseup",jt)}function Dt(e){I.style.left=e.clientX-Re+"px",I.style.top=e.clientY-Xe+"px"}function jt(e){document.removeEventListener("mousemove",Dt),document.removeEventListener("mouseup",jt),I.remove(),I=null;const t=l.getBoundingClientRect(),o=ye;let n=e.clientX-t.left+l.scrollLeft-Re,i=e.clientY-t.top+l.scrollTop-Xe;n=Math.max(0,Math.min(n,j-o.offsetWidth)),i=Math.max(0,Math.min(i,H-o.offsetHeight)),o.style.left=n+"px",o.style.top=i+"px",o.style.opacity="1",ye=null;const a=o.querySelector(".text-box-inner");fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_type:"text",item_id:parseInt(o.dataset.textId),on_board:!0,pos_x:n,pos_y:i,meta:{text:a.innerText,font_size:parseInt(a.style.fontSize)||14,color:a.style.color||"#374151",font_weight:a.style.fontWeight||"400",font_family:(a.style.fontFamily||"'Kosugi Maru', sans-serif").replace(/"/g,"'"),text_align:a.style.textAlign||"left",bg_color:a.dataset.bgColor||"transparent",width:o.offsetWidth,height:o.offsetHeight}})})}let y=null,Ht=0,Wt=0,Kt=0,Zt=0;function it(e,t){e.stopPropagation(),e.preventDefault(),y=t,Ht=e.touches?e.touches[0].clientX:e.clientX,Wt=e.touches?e.touches[0].clientY:e.clientY,Kt=t.offsetWidth,Zt=t.offsetHeight,document.addEventListener("mousemove",Jt),document.addEventListener("mouseup",Ut)}function Jt(e){if(!y)return;y.style.width=Math.max(100,Kt+(e.clientX-Ht))+"px",y.style.height=Math.max(50,Zt+(e.clientY-Wt))+"px";const t=y.querySelector(".text-box-inner");t&&(t.style.minHeight=y.style.height)}function Ut(){if(document.removeEventListener("mousemove",Jt),document.removeEventListener("mouseup",Ut),!y)return;const e=y.querySelector(".text-box-inner");fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_type:"text",item_id:parseInt(y.dataset.textId),on_board:!0,pos_x:parseFloat(y.style.left)||0,pos_y:parseFloat(y.style.top)||0,meta:{text:e.innerText,font_size:parseInt(e.style.fontSize)||14,color:e.style.color||"#374151",font_weight:e.style.fontWeight||"400",font_family:(e.style.fontFamily||"'Kosugi Maru', sans-serif").replace(/"/g,"'"),text_align:e.style.textAlign||"left",bg_color:e.dataset.bgColor||"transparent",width:y.offsetWidth,height:y.offsetHeight}})}),y=null}function Po(){fetch("/board/text",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,text:"テキスト"})}).then(e=>e.json()).then(e=>{const t=Be(e.item);document.getElementById("board-canvas").appendChild(t),ie(t)})}function Yo(e){const t=e.querySelector(".text-box-inner");fetch("/board/text",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,text:t.innerText.trim()})}).then(o=>o.json()).then(o=>{const n=o.item;n.meta={...n.meta,font_size:parseInt(t.style.fontSize)||14,color:t.style.color||"#374151",font_weight:t.style.fontWeight||"400",font_family:(t.style.fontFamily||"'Kosugi Maru', sans-serif").replace(/"/g,"'"),text_align:t.style.textAlign||"left",bg_color:t.dataset.bgColor||"transparent",width:e.offsetWidth,height:e.offsetHeight},N!==e&&(w(0),W(e)),w(u+20),n.pos_x=(parseFloat(e.style.left)||0)+u,n.pos_y=(parseFloat(e.style.top)||0)+u;const i=Be(n);i.querySelectorAll(".text-edit-btn, .text-copy-btn, .text-delete-btn").forEach(a=>a.style.display="none"),i.querySelectorAll(".text-resize-handle").forEach(a=>a.style.display="none"),document.getElementById("board-canvas").appendChild(i),ie(i),fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_type:"text",item_id:parseInt(n.whiteboard_item_id),on_board:!0,pos_x:n.pos_x,pos_y:n.pos_y,meta:n.meta})})})}function Do(e){setTimeout(()=>{if(document.querySelector(`.text-box[data-text-id="${e.whiteboard_item_id}"]`))return;const t=Be(e);document.getElementById("board-canvas").appendChild(t),ie(t)},100)}function jo(e){const t=document.querySelector(`.text-box[data-text-id="${e.itemId}"]`);t&&t.remove()}function Ho(e){var o,n;const t=document.querySelector(`.text-box[data-text-id="${e.itemId}"]`);t&&(t.style.left=e.posX+"px",t.style.top=e.posY+"px",(o=e.meta)!=null&&o.width&&(t.style.width=e.meta.width+"px"),(n=e.meta)!=null&&n.height&&(t.style.height=e.meta.height+"px"))}function Ae(e,t,o,n){switch(e){case"rect":return`<rect x="2" y="2" width="96" height="96"
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
                    marker-end="url(#arrow-${n})"/>`;default:return""}}function Ne(e){const t=e.meta??{},o=t.shape_type??"rect",n=t.fill_color??"#93c5fd",i=t.stroke_color??"#2563eb",a=t.rotation??0,s=document.createElement("div");return s.className="shape-box absolute cursor-grab select-none",s.dataset.shapeId=e.whiteboard_item_id,s.dataset.shapeType=o,s.dataset.fillColor=n,s.dataset.strokeColor=i,s.dataset.rotation=a,s.style.cssText=`
        left:${e.pos_x}px;top:${e.pos_y}px;
        width:${t.width??120}px;height:${t.height??120}px;
        position:absolute;
        transform:rotate(${a}deg);
    `,s.innerHTML=`
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style="overflow:visible;">
            ${Ae(o,n,i,e.whiteboard_item_id)}
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
    `,s}function ae(e){e.addEventListener("mousedown",s=>at(s,e)),e.addEventListener("touchstart",s=>at(s,e),{passive:!1}),e.addEventListener("mouseenter",()=>{e.querySelector(".shape-delete-btn").style.display="block",e.querySelector(".shape-copy-btn").style.display="block",e.querySelector(".shape-color-btn").style.display="block",e.querySelector(".shape-resize-handle").style.display="block",e.querySelector(".shape-rotate-handle").style.display="block"}),e.addEventListener("mouseleave",s=>{s.relatedTarget&&s.relatedTarget.classList.contains("shape-rotate-handle")||(e.querySelector(".shape-delete-btn").style.display="none",e.querySelector(".shape-copy-btn").style.display="none",e.querySelector(".shape-color-btn").style.display="none",e.querySelector(".shape-resize-handle").style.display="none",e.querySelector(".shape-rotate-handle").style.display="none")});const t=e.querySelector(".shape-delete-btn");t.addEventListener("mousedown",s=>s.stopPropagation()),t.addEventListener("click",s=>{s.stopPropagation(),confirm("この図形を削除しますか？")&&fetch("/board/shape/"+e.dataset.shapeId,{method:"DELETE",headers:{"X-CSRF-TOKEN":d}}).then(b=>b.json()).then(()=>e.remove())});const o=e.querySelector(".shape-copy-btn");o.addEventListener("mousedown",s=>s.stopPropagation()),o.addEventListener("click",s=>{s.stopPropagation(),Jo(e)});const n=e.querySelector(".shape-color-btn");n.addEventListener("mousedown",s=>s.stopPropagation()),n.addEventListener("click",s=>{s.stopPropagation(),Zo(e)});const i=e.querySelector(".shape-resize-handle");i.addEventListener("mousedown",s=>st(s,e)),i.addEventListener("touchstart",s=>st(s,e),{passive:!1});const a=e.querySelector(".shape-rotate-handle");a.addEventListener("mouseleave",s=>{v||s.relatedTarget&&(s.relatedTarget===e||e.contains(s.relatedTarget))||(e.querySelector(".shape-delete-btn").style.display="none",e.querySelector(".shape-copy-btn").style.display="none",e.querySelector(".shape-color-btn").style.display="none",e.querySelector(".shape-resize-handle").style.display="none",a.style.display="none")}),a.addEventListener("mousedown",s=>Ko(s,e))}let be=null,$=null,Pe=0,Ye=0,V=null,xe=0,ge=0;function at(e,t){if(e.target.classList.contains("shape-delete-btn")||e.target.classList.contains("shape-copy-btn")||e.target.classList.contains("shape-color-btn")||e.target.classList.contains("shape-resize-handle")||e.target.classList.contains("shape-rotate-handle"))return;const o=e.touches?e.touches[0].clientX:e.clientX,n=e.touches?e.touches[0].clientY:e.clientY;V=t,xe=o,ge=n,document.addEventListener("mousemove",De),document.addEventListener("mouseup",je)}function De(e){const t=e.clientX-xe,o=e.clientY-ge;(Math.abs(t)>4||Math.abs(o)>4)&&(document.removeEventListener("mousemove",De),document.removeEventListener("mouseup",je),Wo(V,xe,ge),V=null)}function je(){document.removeEventListener("mousemove",De),document.removeEventListener("mouseup",je),V=null}function Wo(e,t,o){be=e;const n=e.getBoundingClientRect();Pe=t-n.left,Ye=o-n.top,$=e.cloneNode(!0),$.style.cssText+=`position:fixed;pointer-events:none;z-index:9998;opacity:0.7;
        left:${n.left}px;top:${n.top}px;width:${n.width}px;`,document.body.appendChild($),e.style.opacity="0.3",document.addEventListener("mousemove",Gt),document.addEventListener("mouseup",Vt)}function Gt(e){$.style.left=e.clientX-Pe+"px",$.style.top=e.clientY-Ye+"px"}function Vt(e){document.removeEventListener("mousemove",Gt),document.removeEventListener("mouseup",Vt),$.remove(),$=null;const t=l.getBoundingClientRect(),o=be;let n=e.clientX-t.left+l.scrollLeft-Pe,i=e.clientY-t.top+l.scrollTop-Ye;n=Math.max(0,Math.min(n,j-o.offsetWidth)),i=Math.max(0,Math.min(i,H-o.offsetHeight)),o.style.left=n+"px",o.style.top=i+"px",o.style.opacity="1",be=null,se(o,n,i)}function se(e,t,o){fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_type:"shape",item_id:parseInt(e.dataset.shapeId),on_board:!0,pos_x:t,pos_y:o,meta:{shape_type:e.dataset.shapeType,fill_color:e.dataset.fillColor,stroke_color:e.dataset.strokeColor,rotation:parseInt(e.dataset.rotation)||0,width:e.offsetWidth,height:e.offsetHeight}})})}let _=null,Qt=0,eo=0,to=0,oo=0;function st(e,t){e.stopPropagation(),e.preventDefault(),_=t,Qt=e.touches?e.touches[0].clientX:e.clientX,eo=e.touches?e.touches[0].clientY:e.clientY,to=t.offsetWidth,oo=t.offsetHeight,document.addEventListener("mousemove",no),document.addEventListener("mouseup",io)}function no(e){_&&(_.style.width=Math.max(20,to+(e.clientX-Qt))+"px",_.style.height=Math.max(20,oo+(e.clientY-eo))+"px")}function io(){document.removeEventListener("mousemove",no),document.removeEventListener("mouseup",io),_&&(se(_,parseFloat(_.style.left)||0,parseFloat(_.style.top)||0),_=null)}let v=null,ao=0,so=0;function Ko(e,t){e.stopPropagation(),e.preventDefault(),v=t;const o=t.getBoundingClientRect();ao=o.left+o.width/2,so=o.top+o.height/2,parseInt(t.dataset.rotation),document.addEventListener("mousemove",ro),document.addEventListener("mouseup",lo)}function ro(e){if(!v)return;const t=e.clientX-ao,o=e.clientY-so,n=Math.round(Math.atan2(o,t)*(180/Math.PI)+90);v.style.transform=`rotate(${n}deg)`,v.dataset.rotation=n}function lo(){document.removeEventListener("mousemove",ro),document.removeEventListener("mouseup",lo),v&&(se(v,parseFloat(v.style.left)||0,parseFloat(v.style.top)||0),v=null)}const m=document.createElement("div");m.id="shape-color-modal";m.style.cssText=`
    display:none;position:fixed;inset:0;z-index:99999;
    background:rgba(0,0,0,0.4);
    align-items:center;justify-content:center;
`;m.innerHTML=`
    <div style="background:white;border-radius:12px;padding:24px;width:280px;">
        <p style="font-size:15px;font-weight:500;margin-bottom:16px;">色を変更</p>
        <div style="margin-bottom:16px;">
            <label style="font-size:12px;color:#6b7280;display:block;margin-bottom:6px;">塗りつぶし色</label>
            <div id="shape-fill-palette" style="display:flex;flex-wrap:wrap;gap:3px;width:${10*23}px;">
                ${Z.map(e=>`
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
                ${Z.map(e=>`
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
`;document.body.appendChild(m);let z=null;document.getElementById("shape-color-cancel").addEventListener("click",()=>{m.style.display="none"});let Y="#93c5fd",D="#2563eb";m.querySelectorAll(".fill-chip").forEach(e=>{e.addEventListener("click",()=>{Y=e.dataset.color,m.querySelectorAll(".fill-chip").forEach(t=>{t.style.outline="none",t.style.transform="scale(1)"}),e.style.outline="2px solid #374151",e.style.outlineOffset="2px",e.style.transform="scale(1.2)"})});m.querySelectorAll(".stroke-chip").forEach(e=>{e.addEventListener("click",()=>{D=e.dataset.color,m.querySelectorAll(".stroke-chip").forEach(t=>{t.style.outline="none",t.style.transform="scale(1)"}),e.style.outline="2px solid #374151",e.style.outlineOffset="2px",e.style.transform="scale(1.2)"})});document.getElementById("shape-color-save").addEventListener("click",()=>{z.dataset.fillColor=Y,z.dataset.strokeColor=D;const e=z.querySelector("svg");e.innerHTML=Ae(z.dataset.shapeType,Y,D,z.dataset.shapeId),se(z,parseFloat(z.style.left)||0,parseFloat(z.style.top)||0),m.style.display="none"});function Zo(e){z=e,Y=e.dataset.fillColor||"#93c5fd",D=e.dataset.strokeColor||"#2563eb",m.querySelectorAll(".fill-chip").forEach(t=>{const o=t.dataset.color===Y;t.style.outline=o?"2px solid #374151":"none",t.style.outlineOffset="2px",t.style.transform=o?"scale(1.2)":"scale(1)"}),m.querySelectorAll(".stroke-chip").forEach(t=>{const o=t.dataset.color===D;t.style.outline=o?"2px solid #374151":"none",t.style.outlineOffset="2px",t.style.transform=o?"scale(1.2)":"scale(1)"}),m.style.display="flex"}function Jo(e){fetch("/board/shape",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,shape_type:e.dataset.shapeType})}).then(t=>t.json()).then(t=>{const o=t.item;N!==e&&(w(0),W(e)),w(u+20);const n=(parseFloat(e.style.left)||0)+u,i=(parseFloat(e.style.top)||0)+u;o.pos_x=n,o.pos_y=i,o.meta={shape_type:e.dataset.shapeType,fill_color:e.dataset.fillColor,stroke_color:e.dataset.strokeColor,rotation:parseInt(e.dataset.rotation)||0,width:e.offsetWidth,height:e.offsetHeight};const a=Ne(o);a.querySelectorAll(".shape-delete-btn, .shape-copy-btn, .shape-color-btn").forEach(s=>s.style.display="none"),a.querySelectorAll(".shape-resize-handle, .shape-rotate-handle").forEach(s=>s.style.display="none"),document.getElementById("board-canvas").appendChild(a),ae(a),fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_type:"shape",item_id:parseInt(o.whiteboard_item_id),on_board:!0,pos_x:n,pos_y:i,meta:o.meta})})})}function Uo(e){fetch("/board/shape",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,shape_type:e})}).then(t=>t.json()).then(t=>{const o=Ne(t.item);document.getElementById("board-canvas").appendChild(o),ae(o)})}function Go(e){setTimeout(()=>{if(document.querySelector(`.shape-box[data-shape-id="${e.whiteboard_item_id}"]`))return;const t=Ne(e);document.getElementById("board-canvas").appendChild(t),ae(t)},100)}function Vo(e){const t=document.querySelector(`.shape-box[data-shape-id="${e.itemId}"]`);t&&t.remove()}function Qo(e){var o,n,i,a,s;const t=document.querySelector(`.shape-box[data-shape-id="${e.itemId}"]`);if(t&&(t.style.left=e.posX+"px",t.style.top=e.posY+"px",t.style.transform=`rotate(${((o=e.meta)==null?void 0:o.rotation)??0}deg)`,(n=e.meta)!=null&&n.width&&(t.style.width=e.meta.width+"px"),(i=e.meta)!=null&&i.height&&(t.style.height=e.meta.height+"px"),(a=e.meta)!=null&&a.fillColor||(s=e.meta)!=null&&s.strokeColor)){t.dataset.fillColor=e.meta.fillColor,t.dataset.strokeColor=e.meta.strokeColor;const b=t.querySelector("svg");b.innerHTML=Ae(t.dataset.shapeType,e.meta.fillColor,e.meta.strokeColor,e.itemId)}}function He(e){const t=e.meta??{},o=document.createElement("div");return o.className="image-box absolute cursor-grab select-none",o.dataset.imageId=e.whiteboard_item_id,o.style.cssText=`
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
    `,o}function re(e){e.addEventListener("mousedown",i=>rt(i,e)),e.addEventListener("touchstart",i=>rt(i,e),{passive:!1}),e.addEventListener("mouseenter",()=>{e.querySelector(".image-delete-btn").style.display="block",e.querySelector(".image-copy-btn").style.display="block",e.querySelector(".image-resize-handle").style.display="block"}),e.addEventListener("mouseleave",()=>{e.querySelector(".image-delete-btn").style.display="none",e.querySelector(".image-copy-btn").style.display="none",e.querySelector(".image-resize-handle").style.display="none"});const t=e.querySelector(".image-delete-btn");t.addEventListener("mousedown",i=>i.stopPropagation()),t.addEventListener("click",i=>{i.stopPropagation(),confirm("この画像を削除しますか？")&&fetch("/board/image/"+e.dataset.imageId,{method:"DELETE",headers:{"X-CSRF-TOKEN":d}}).then(a=>a.json()).then(()=>e.remove())});const o=e.querySelector(".image-copy-btn");o.addEventListener("mousedown",i=>i.stopPropagation()),o.addEventListener("click",i=>{i.stopPropagation(),on(e)});const n=e.querySelector(".image-resize-handle");n.addEventListener("mousedown",i=>dt(i,e)),n.addEventListener("touchstart",i=>dt(i,e),{passive:!1})}let ve=null,O=null,We=0,Ke=0,Q=null,Ee=0,Se=0;function rt(e,t){if(e.target.classList.contains("image-delete-btn")||e.target.classList.contains("image-copy-btn")||e.target.classList.contains("image-resize-handle"))return;const o=e.touches?e.touches[0].clientX:e.clientX,n=e.touches?e.touches[0].clientY:e.clientY;Q=t,Ee=o,Se=n,document.addEventListener("mousemove",Ze),document.addEventListener("mouseup",Je)}function Ze(e){const t=e.clientX-Ee,o=e.clientY-Se;(Math.abs(t)>4||Math.abs(o)>4)&&(document.removeEventListener("mousemove",Ze),document.removeEventListener("mouseup",Je),en(Q,Ee,Se),Q=null)}function Je(){document.removeEventListener("mousemove",Ze),document.removeEventListener("mouseup",Je),Q=null}function en(e,t,o){ve=e;const n=e.getBoundingClientRect();We=t-n.left,Ke=o-n.top,O=e.cloneNode(!0),O.style.cssText+=`position:fixed;pointer-events:none;z-index:9998;opacity:0.7;
        left:${n.left}px;top:${n.top}px;width:${n.width}px;height:${n.height}px;`,document.body.appendChild(O),e.style.opacity="0.3",document.addEventListener("mousemove",co),document.addEventListener("mouseup",po)}function co(e){O.style.left=e.clientX-We+"px",O.style.top=e.clientY-Ke+"px"}function po(e){document.removeEventListener("mousemove",co),document.removeEventListener("mouseup",po),O.remove(),O=null;const t=l.getBoundingClientRect(),o=ve;let n=e.clientX-t.left+l.scrollLeft-We,i=e.clientY-t.top+l.scrollTop-Ke;n=Math.max(0,Math.min(n,j-o.offsetWidth)),i=Math.max(0,Math.min(i,H-o.offsetHeight)),o.style.left=n+"px",o.style.top=i+"px",o.style.opacity="1",ve=null,uo(o,n,i)}function uo(e,t,o){const n=e.querySelector("img");fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_type:"image",item_id:parseInt(e.dataset.imageId),on_board:!0,pos_x:t,pos_y:o,meta:{src:n.src.replace(location.origin,""),width:e.offsetWidth,height:e.offsetHeight}})})}let C=null,ho=0,yo=0,fo=0,mo=0;function dt(e,t){e.stopPropagation(),e.preventDefault(),C=t,ho=e.touches?e.touches[0].clientX:e.clientX,yo=e.touches?e.touches[0].clientY:e.clientY,fo=t.offsetWidth,mo=t.offsetHeight,document.addEventListener("mousemove",bo),document.addEventListener("mouseup",xo)}function bo(e){C&&(C.style.width=Math.max(40,fo+(e.clientX-ho))+"px",C.style.height=Math.max(40,mo+(e.clientY-yo))+"px")}function xo(){document.removeEventListener("mousemove",bo),document.removeEventListener("mouseup",xo),C&&(uo(C,parseFloat(C.style.left)||0,parseFloat(C.style.top)||0),C=null)}function tn(){const e=document.createElement("input");e.type="file",e.accept="image/*",e.addEventListener("change",()=>{const t=e.files[0];if(!t)return;const o=new FormData;o.append("whiteboard_id",c),o.append("image",t),fetch("/board/image",{method:"POST",headers:{"X-CSRF-TOKEN":d},body:o}).then(n=>n.json()).then(n=>{const i=He(n.item);document.getElementById("board-canvas").appendChild(i),re(i)})}),e.click()}function on(e){const o=e.querySelector("img").src.replace(location.origin,"");fetch("/board/image/copy",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,src:o,width:e.offsetWidth,height:e.offsetHeight})}).then(n=>n.json()).then(n=>{const i=n.item;N!==e&&(w(0),W(e)),w(u+20),i.pos_x=(parseFloat(e.style.left)||0)+u,i.pos_y=(parseFloat(e.style.top)||0)+u;const a=He(i);a.querySelectorAll(".image-delete-btn, .image-copy-btn").forEach(s=>s.style.display="none"),a.querySelectorAll(".image-resize-handle").forEach(s=>s.style.display="none"),document.getElementById("board-canvas").appendChild(a),re(a),fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c,item_type:"image",item_id:parseInt(i.whiteboard_item_id),on_board:!0,pos_x:i.pos_x,pos_y:i.pos_y,meta:i.meta})})})}function nn(e){setTimeout(()=>{if(document.querySelector(`.image-box[data-image-id="${e.whiteboard_item_id}"]`))return;const t=He(e);document.getElementById("board-canvas").appendChild(t),re(t)},100)}function an(e){const t=document.querySelector(`.image-box[data-image-id="${e.itemId}"]`);t&&t.remove()}function sn(e){var o,n;const t=document.querySelector(`.image-box[data-image-id="${e.itemId}"]`);t&&(t.style.left=e.posX+"px",t.style.top=e.posY+"px",(o=e.meta)!=null&&o.width&&(t.style.width=e.meta.width+"px"),(n=e.meta)!=null&&n.height&&(t.style.height=e.meta.height+"px"))}window.addStaff=_o;window.addZone=Bo;window.addText=Po;window.addShape=Uo;window.clearBoard=rn;window.addImage=tn;document.querySelectorAll(".magnet").forEach(e=>oe(e));document.querySelectorAll(".magnet-zone").forEach(e=>ne(e));document.querySelectorAll(".text-box").forEach(e=>ie(e));document.querySelectorAll(".shape-box").forEach(e=>ae(e));document.querySelectorAll(".image-box").forEach(e=>re(e));let ee=!1,go=0,vo=0,Eo=0,So=0;l.addEventListener("mousedown",e=>{if(e.target===l||e.target.id==="board-canvas"||e.target.closest("#board-canvas")===document.getElementById("board-canvas")&&!e.target.closest(".magnet")&&!e.target.closest(".magnet-zone")&&!e.target.closest(".text-box")&&!e.target.closest(".shape-box")&&!e.target.closest(".image-box")){const t=document.querySelector('.text-box-inner[contenteditable="true"]');if(t){t.blur();return}ee=!0,go=e.clientX,vo=e.clientY,Eo=l.scrollLeft,So=l.scrollTop,l.style.cursor="grabbing",e.preventDefault()}});document.addEventListener("mousemove",e=>{ee&&(l.scrollLeft=Eo-(e.clientX-go),l.scrollTop=So-(e.clientY-vo))});document.addEventListener("mouseup",()=>{ee&&(ee=!1,l.style.cursor="default")});document.getElementById("board-canvas").addEventListener("mousedown",e=>{if(e.target.closest(".text-box"))return;const t=document.querySelector('.text-box-inner[contenteditable="true"]');t&&t.blur()});window.Echo.channel("whiteboard."+c).listen(".board.updated",e=>{switch(e.action){case"item.updated":e.payload.itemType==="staff"&&Io(e.payload),e.payload.itemType==="zone"&&Ao(e.payload),e.payload.itemType==="text"&&Ho(e.payload),e.payload.itemType==="shape"&&Qo(e.payload),e.payload.itemType==="image"&&sn(e.payload);break;case"staff.added":To(e.payload);break;case"staff.deleted":ko(e.payload);break;case"staff.updated":qo(e.payload);break;case"zone.added":Mo(e.payload);break;case"zone.deleted":Fo(e.payload);break;case"text.added":Do(e.payload);break;case"text.deleted":jo(e.payload);break;case"shape.added":Go(e.payload);break;case"shape.deleted":Vo(e.payload);break;case"image.added":nn(e.payload);break;case"image.deleted":an(e.payload);break}});function rn(){confirm(`ボード上の全ての要素を削除しますか？
この操作は元に戻せません。`)&&fetch("/board/clear",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d},body:JSON.stringify({whiteboard_id:c})}).then(e=>e.json()).then(()=>{document.querySelectorAll(".magnet").forEach(e=>e.remove()),document.querySelectorAll(".magnet-zone").forEach(e=>e.remove()),document.querySelectorAll(".text-box").forEach(e=>e.remove()),document.querySelectorAll(".shape-box").forEach(e=>e.remove()),document.querySelectorAll(".image-box").forEach(e=>e.remove())})}
