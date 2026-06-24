const p=document.getElementById("board");document.getElementById("tray");const u=parseInt(p.dataset.whiteboardId),Y=parseInt(p.dataset.canvasW),D=parseInt(p.dataset.canvasH),c=document.querySelector('meta[name="csrf-token"]').content,O=[{bg:"#E6F1FB",border:"#378ADD",text:"#0C447C"},{bg:"#EAF3DE",border:"#639922",text:"#27500A"},{bg:"#FAEEDA",border:"#BA7517",text:"#633806"},{bg:"#FBEAF0",border:"#D4537E",text:"#72243E"},{bg:"#E1F5EE",border:"#1D9E75",text:"#085041"},{bg:"#EEEDFE",border:"#7F77DD",text:"#3C3489"},{bg:"#FAECE7",border:"#D85A30",text:"#711B13"},{bg:"#FEF9E7",border:"#D4AC0D",text:"#7D6608"},{bg:"#F2F3F4",border:"#717D7E",text:"#2C3E50"},{bg:"#FDEDEC",border:"#C0392B",text:"#7B241C"}],se=[{border:"#378ADD",bg:"rgba(56,138,221,0.06)",text:"#0C447C"},{border:"#639922",bg:"rgba(99,153,34,0.06)",text:"#27500A"},{border:"#D4537E",bg:"rgba(212,83,126,0.06)",text:"#72243E"},{border:"#BA7517",bg:"rgba(186,117,23,0.06)",text:"#633806"},{border:"#7F77DD",bg:"rgba(127,119,221,0.06)",text:"#3C3489"},{border:"#1D9E75",bg:"rgba(29,158,117,0.06)",text:"#085041"},{border:"#D85A30",bg:"rgba(216,90,48,0.06)",text:"#711B13"},{border:"#D4AC0D",bg:"rgba(212,172,13,0.06)",text:"#7D6608"},{border:"#717D7E",bg:"rgba(113,125,126,0.06)",text:"#2C3E50"},{border:"#C0392B",bg:"rgba(192,57,43,0.06)",text:"#7B241C"}],Q=["#374151","#ffffff","#dc2626","#ea580c","#ca8a04","#16a34a","#2563eb","#7c3aed","#ec4899","#000000","#6b7280","#b91c1c","#92400e","#854d0e","#065f46","#1e40af","#5b21b6","#9d174d","#0891b2","#fca5a5","#fdba74","#fde047","#86efac","#93c5fd","#c4b5fd","#f9a8d4","#67e8f9","#9ca3af","#e5e7eb"];let f=0,H=null;function k(e){f=e}function Z(e){H=e}function J(e){e.querySelectorAll("[data-tippy-content]").forEach(t=>{t._tippy||tippy(t,{duration:500,maxWidth:"none",allowHTML:!0,placement:"top",theme:"tippy_main_theme"})})}let S=null,L=null,Te=0,Ce=0,ee=null,fe=0,me=0;function re(e){e.addEventListener("mousedown",i=>tt(i,e)),e.addEventListener("touchstart",i=>tt(i,e),{passive:!1}),e.addEventListener("mouseenter",()=>{const i=e.querySelector(".chip-edit-btn");i&&(i.style.display="flex");const s=e.querySelector(".chip-copy-btn");s&&(s.style.display="flex");const d=e.querySelector(".chip-delete-btn");d&&(d.style.display="block");const l=e.querySelector(".chip-resize-handle");l&&(l.style.display="block")}),e.addEventListener("mouseleave",()=>{const i=e.querySelector(".chip-edit-btn");i&&(i.style.display="none");const s=e.querySelector(".chip-copy-btn");s&&(s.style.display="none");const d=e.querySelector(".chip-delete-btn");d&&(d.style.display="none");const l=e.querySelector(".chip-resize-handle");l&&(l.style.display="none")});const t=e.querySelector(".chip-edit-btn");t&&(t.addEventListener("mousedown",i=>i.stopPropagation()),t.addEventListener("click",i=>{i.stopPropagation(),qo(i,e)}));const o=e.querySelector(".chip-copy-btn");o&&(o.addEventListener("mousedown",i=>i.stopPropagation()),o.addEventListener("click",i=>{i.stopPropagation(),$o(e)}));const n=e.querySelector(".chip-delete-btn");n&&(n.addEventListener("mousedown",i=>i.stopPropagation()),n.addEventListener("click",i=>{i.stopPropagation(),confirm("このスタッフを削除しますか？")&&fetch("/board/staff/"+e.dataset.id,{method:"DELETE",headers:{"X-CSRF-TOKEN":c}}).then(s=>s.json()).then(()=>e.remove())}));const a=e.querySelector(".chip-resize-handle");a&&(a.addEventListener("mousedown",i=>ot(i,e)),a.addEventListener("touchstart",i=>ot(i,e),{passive:!1})),J(e)}function tt(e,t){S&&(S.style.opacity="1",S=null),L&&(L.remove(),L=null);const o=e.touches?e.touches[0].clientX:e.clientX,n=e.touches?e.touches[0].clientY:e.clientY;ee=t,fe=o,me=n,document.addEventListener("mousemove",qe),document.addEventListener("mouseup",Ie)}function qe(e){const t=e.clientX-fe,o=e.clientY-me;(Math.abs(t)>4||Math.abs(o)>4)&&(document.removeEventListener("mousemove",qe),document.removeEventListener("mouseup",Ie),Co(ee,fe,me),ee=null)}function Ie(){document.removeEventListener("mousemove",qe),document.removeEventListener("mouseup",Ie),ee=null}function Co(e,t,o){S=e;const n=e.getBoundingClientRect();Te=t-n.left,Ce=o-n.top,L=e.cloneNode(!0),L.style.cssText=`
        position:fixed;pointer-events:none;z-index:9999;opacity:0.85;
        left:${n.left}px;top:${n.top}px;
        transform:rotate(2deg) scale(1.05);
    `,document.body.appendChild(L),e.style.opacity="0.3",document.addEventListener("mousemove",ht),document.addEventListener("mouseup",mt),document.addEventListener("touchmove",yt,{passive:!1}),document.addEventListener("touchend",xt)}function ht(e){ft(e.clientX,e.clientY)}function yt(e){e.preventDefault(),ft(e.touches[0].clientX,e.touches[0].clientY)}function ft(e,t){L.style.left=e-Te+"px",L.style.top=t-Ce+"px"}function mt(e){bt(e.clientX,e.clientY)}function xt(e){bt(e.changedTouches[0].clientX,e.changedTouches[0].clientY)}function bt(e,t){document.removeEventListener("mousemove",ht),document.removeEventListener("mouseup",mt),document.removeEventListener("touchmove",yt),document.removeEventListener("touchend",xt),L.remove(),L=null;const o=p.getBoundingClientRect(),n=S.dataset.id;let a=e-o.left+p.scrollLeft-Te,i=t-o.top+p.scrollTop-Ce;a=Math.max(0,Math.min(a,Y-80)),i=Math.max(0,Math.min(i,D-50)),$e(n,a,i),S.style.position="absolute",S.style.left=a+"px",S.style.top=i+"px",document.getElementById("board-canvas").appendChild(S),S.style.opacity="1",S=null}function $e(e,t,o){const n=document.querySelector(`.magnet[data-id="${e}"]`),a=n?n.querySelector(".staff-chip-wrap > div"):null;a&&(a.offsetWidth,a.offsetHeight),fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":c},body:JSON.stringify({whiteboard_id:u,item_type:"staff",item_id:parseInt(e),pos_x:t,pos_y:o,meta:{staff_name:(n==null?void 0:n.dataset.name)??"",role_name:(n==null?void 0:n.dataset.role)??"",color:parseInt((n==null?void 0:n.dataset.color)??0),shape:(n==null?void 0:n.dataset.shape)??"rect",width:a?a.offsetWidth:90,height:a?a.offsetHeight:40}})})}let b=null,gt=0,vt=0,Et=0,wt=0;function ot(e,t){e.stopPropagation(),e.preventDefault(),b=t,gt=e.touches?e.touches[0].clientX:e.clientX,vt=e.touches?e.touches[0].clientY:e.clientY;const o=t.querySelector(".staff-chip-wrap > div");Et=o?o.offsetWidth:90,wt=o?o.offsetHeight:40,document.addEventListener("mousemove",St),document.addEventListener("mouseup",_t),document.addEventListener("touchmove",zt,{passive:!1}),document.addEventListener("touchend",kt)}function St(e){Lt(e.clientX,e.clientY)}function zt(e){e.preventDefault(),Lt(e.touches[0].clientX,e.touches[0].clientY)}function Lt(e,t){if(!b)return;const o=b.querySelector(".staff-chip-wrap > div");o&&(o.style.width=Math.max(50,Et+(e-gt))+"px",o.style.height=Math.max(50,wt+(t-vt))+"px")}function _t(){Tt()}function kt(){Tt()}function Tt(){if(document.removeEventListener("mousemove",St),document.removeEventListener("mouseup",_t),document.removeEventListener("touchmove",zt),document.removeEventListener("touchend",kt),!b)return;const e=b.querySelector(".staff-chip-wrap > div"),t=b.dataset.id;fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":c},body:JSON.stringify({whiteboard_id:u,item_type:"staff",item_id:parseInt(t),pos_x:parseFloat(b.style.left)||0,pos_y:parseFloat(b.style.top)||0,meta:{staff_name:b.dataset.name??"",role_name:b.dataset.role??"",color:parseInt(b.dataset.color??0),shape:b.dataset.shape??"rect",width:e?e.offsetWidth:90,height:e?e.offsetHeight:40}})}),b=null}let Ct=null,q=null,A=0,qt="M",B="rect";const y=document.createElement("div");y.id="staff-edit-modal";y.style.cssText=`
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
                <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;width:180px;">
                    ${O.map((e,t)=>`
                        <div class="edit-color-chip" data-color="${t}"
                            style="height:32px;border-radius:6px;cursor:pointer;
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
`;document.body.appendChild(y);y.querySelectorAll(".modal-tab").forEach(e=>{e.addEventListener("click",()=>{y.querySelectorAll(".modal-tab").forEach(t=>{t.style.borderBottomColor="transparent",t.style.color="#9ca3af"}),e.style.borderBottomColor="#374151",e.style.color="#374151",document.getElementById("tab-basic").style.display=e.dataset.tab==="basic"?"block":"none",document.getElementById("tab-appearance").style.display=e.dataset.tab==="appearance"?"block":"none"})});y.querySelectorAll(".edit-color-chip").forEach(e=>{e.addEventListener("click",()=>{A=parseInt(e.dataset.color),y.querySelectorAll(".edit-color-chip").forEach(t=>{t.style.transform="scale(1)",t.style.outline="none"}),e.style.transform="scale(1.2)",e.style.outline="2px solid #374151",e.style.outlineOffset="2px"})});y.querySelectorAll(".edit-shape-chip").forEach(e=>{e.addEventListener("click",()=>{B=e.dataset.shape,y.querySelectorAll(".edit-shape-chip").forEach(t=>{t.style.borderColor="#d1d5db",t.style.background="white"}),e.style.borderColor="#374151",e.style.background="#f3f4f6"})});document.getElementById("edit-cancel").addEventListener("click",()=>{y.style.display="none"});function qo(e,t){e.preventDefault(),Ct=t.dataset.id,q=t;const o=y.querySelector('.modal-tab[data-tab="appearance"]');o&&(o.style.display="block"),document.getElementById("edit-name").value=t.dataset.name??"",document.getElementById("edit-role").value=t.dataset.role??"",A=parseInt(t.dataset.color??0)||0,qt=t.dataset.size??"M",B=t.dataset.shape??"rect",y.querySelectorAll(".edit-color-chip").forEach(a=>{a.style.transform="scale(1)",a.style.outline="none"});const n=y.querySelector(`.edit-color-chip[data-color="${A}"]`);n&&(n.style.transform="scale(1.2)",n.style.outline="2px solid #374151",n.style.outlineOffset="2px"),y.querySelectorAll(".edit-shape-chip").forEach(a=>{const i=a.dataset.shape===B;a.style.borderColor=i?"#374151":"#d1d5db",a.style.background=i?"#f3f4f6":"white"}),document.getElementById("tab-basic").style.display="block",document.getElementById("tab-appearance").style.display="none",y.querySelectorAll(".modal-tab").forEach(a=>{const i=a.dataset.tab==="basic";a.style.borderBottomColor=i?"#374151":"transparent",a.style.color=i?"#374151":"#9ca3af"}),y.style.display="flex"}document.getElementById("edit-save").addEventListener("click",()=>{const e=document.getElementById("edit-name").value.trim(),t=document.getElementById("edit-role").value.trim();if(!e)return;const o=q.querySelector(".staff-chip-wrap"),n=o.querySelector("div");fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":c},body:JSON.stringify({whiteboard_id:u,item_type:"staff",item_id:parseInt(Ct),pos_x:parseFloat(q.style.left)||0,pos_y:parseFloat(q.style.top)||0,meta:{staff_name:e,role_name:t,color:A,shape:B,width:n?n.offsetWidth:90,height:n?n.offsetHeight:40}})}).then(a=>a.json()).then(()=>{const a=O[A],i={rect:"border-radius:8px;clip-path:none;",circle:"border-radius:50%;clip-path:none;",sharp:"border-radius:0;clip-path:none;",rounded_bottom:"border-radius:0 0 50% 50%;clip-path:none;",tab:"border-radius:0 0 8px 8px;clip-path:none;"};n.style.cssText=`
            background:${a.bg};
            border:2px solid ${a.border};
            border-top:${B==="tab"?"4px":"2px"} solid ${a.border};
            width:${n.style.width||n.offsetWidth+"px"};
            height:${n.style.height||n.offsetHeight+"px"};
            padding:6px;text-align:center;
            ${i[B]??i.rect}
        `,q.dataset.shape=B,q.dataset.size=qt,q.dataset.color=A,q.dataset.name=e,q.dataset.role=t;const s=o.querySelector('[data-field="name"]'),d=o.querySelector('[data-field="role"]');s&&(s.textContent=e,s.style.color=a.text),d&&(d.textContent=t,d.style.color=a.text),y.style.display="none"})});function Io(){const e=document.getElementById("newName").value.trim(),t=document.getElementById("newRole").value.trim();e&&fetch("/board/staff",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":c},body:JSON.stringify({whiteboard_id:u,staff_name:e,role_name:t})}).then(o=>o.json()).then(o=>{var s,d,l,h,E,C,w;const n=o.item,a=O[(((s=n.meta)==null?void 0:s.color)??0)%O.length],i=document.createElement("div");i.className="magnet absolute cursor-grab select-none",i.dataset.id=n.whiteboard_item_id,i.dataset.color=((d=n.meta)==null?void 0:d.color)??0,i.dataset.name=((l=n.meta)==null?void 0:l.staff_name)??"",i.dataset.role=((h=n.meta)==null?void 0:h.role_name)??"",i.dataset.shape=((E=n.meta)==null?void 0:E.shape)??"rect",i.style.left="40px",i.style.top="40px",i.innerHTML=It(((C=n.meta)==null?void 0:C.staff_name)??"",((w=n.meta)==null?void 0:w.role_name)??"",a),re(i),document.getElementById("board-canvas").appendChild(i),$e(n.whiteboard_item_id,40,40),document.getElementById("newName").value="",document.getElementById("newRole").value=""})}function It(e,t,o){return`
        <div class="staff-chip-wrap" style="position:relative;display:inline-block;">
            <div style="width:90px;padding:6px;border-radius:8px;text-align:center;
                        border:2px solid ${o.border};background:${o.bg};">
                <div data-field="name" style="font-size:12px;font-weight:500;color:${o.text};">${e}</div>
                <div data-field="role" style="font-size:10px;color:${o.text};opacity:.7;">${t}</div>
            </div>
            <div class="chip-edit-btn" data-tippy-content="編集" style="display:none;position:absolute;top:-7px;right:-7px;
                width:18px;height:18px;border-radius:50%;background:#374151;color:white;font-size:10px;
                align-items:center;justify-content:center;cursor:pointer;z-index:10;">✏</div>
            <div class="chip-copy-btn" data-tippy-content="複製" style="display:none;position:absolute;top:-7px;right:14px;
                width:18px;height:18px;border-radius:50%;background:#374151;color:white;font-size:10px;
                align-items:center;justify-content:center;cursor:pointer;z-index:10;">📋</div>
            <div class="chip-delete-btn" data-tippy-content="削除" style="display:none;position:absolute;top:-7px;left:-7px;
                width:18px;height:18px;border-radius:50%;background:#ef4444;color:white;font-size:12px;
                line-height:18px;text-align:center;cursor:pointer;z-index:10;">×</div>
            <div class="chip-resize-handle" data-tippy-content="サイズ変更" style="
                display:none;position:absolute;bottom:-4px;right:-4px;
                width:14px;height:14px;border-radius:2px;
                color:#374151;font-size:18px;line-height:14px;text-align:center;
                cursor:se-resize;z-index:10;user-select:none;
            ">⤡</div>
        </div>`}function $o(e){fetch("/board/staff",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":c},body:JSON.stringify({whiteboard_id:u,staff_name:e.dataset.name,role_name:e.dataset.role,color:parseInt(e.dataset.color)||0})}).then(t=>t.json()).then(t=>{var s,d,l;const o=t.item,n=document.createElement("div");n.className="magnet absolute cursor-grab select-none",n.dataset.id=o.whiteboard_item_id,n.dataset.color=((s=o.meta)==null?void 0:s.color)??0,n.dataset.name=((d=o.meta)==null?void 0:d.staff_name)??"",n.dataset.role=((l=o.meta)==null?void 0:l.role_name)??"",n.dataset.size=e.dataset.size??"M",n.dataset.shape=e.dataset.shape??"rect",n.innerHTML=e.innerHTML,n.querySelectorAll(".chip-edit-btn, .chip-copy-btn").forEach(h=>h.style.display="none"),n.querySelectorAll(".chip-resize-handle").forEach(h=>h.style.display="none"),re(n),H!==e&&(k(0),Z(e)),k(f+20);const a=(parseFloat(e.style.left)||0)+f,i=(parseFloat(e.style.top)||0)+f;n.style.left=a+"px",n.style.top=i+"px",document.getElementById("board-canvas").appendChild(n),$e(o.whiteboard_item_id,a,i)})}function Mo(e){setTimeout(()=>{var n,a,i,s,d,l,h;if(document.querySelector(`.magnet[data-id="${e.whiteboard_item_id}"]`))return;const t=O[(((n=e.meta)==null?void 0:n.color)??0)%O.length],o=document.createElement("div");o.className="magnet absolute cursor-grab select-none",o.dataset.id=e.whiteboard_item_id,o.dataset.color=((a=e.meta)==null?void 0:a.color)??0,o.dataset.name=((i=e.meta)==null?void 0:i.staff_name)??"",o.dataset.role=((s=e.meta)==null?void 0:s.role_name)??"",o.dataset.shape=((d=e.meta)==null?void 0:d.shape)??"rect",o.style.left="40px",o.style.top="40px",o.innerHTML=It(((l=e.meta)==null?void 0:l.staff_name)??"",((h=e.meta)==null?void 0:h.role_name)??"",t),re(o),document.getElementById("board-canvas").appendChild(o)},100)}function Oo(e){const t=document.querySelector(`.magnet[data-id="${e.staffId}"]`);t&&t.remove()}function Bo(e){var o,n,a,i,s;const t=document.querySelector(`.magnet[data-id="${e.itemId}"]`);if(t){if(t.style.position="absolute",t.style.left=e.posX+"px",t.style.top=e.posY+"px",(o=e.meta)!=null&&o.width&&(t.querySelector(".staff-chip-wrap > div").style.width=e.meta.width+"px"),(n=e.meta)!=null&&n.height&&(t.querySelector(".staff-chip-wrap > div").style.height=e.meta.height+"px"),(a=e.meta)!=null&&a.staff_name||((i=e.meta)==null?void 0:i.color)!==void 0||(s=e.meta)!=null&&s.shape){const d=O[(e.meta.color??0)%O.length],l=t.querySelector(".staff-chip-wrap"),h=l==null?void 0:l.querySelector("div"),E={rect:"border-radius:8px;",circle:"border-radius:50%;",sharp:"border-radius:0;",rounded_bottom:"border-radius:0 0 50% 50%;",tab:"border-radius:0 0 8px 8px;"};h&&(h.style.cssText=`
                background:${d.bg};border:2px solid ${d.border};
                width:${h.style.width||h.offsetWidth+"px"};
                height:${h.style.height||h.offsetHeight+"px"};
                padding:6px;text-align:center;
                ${E[e.meta.shape]??E.rect}
            `),t.dataset.name=e.meta.staff_name??"",t.dataset.role=e.meta.role_name??"",t.dataset.color=e.meta.color??0,t.dataset.shape=e.meta.shape??"rect";const C=l==null?void 0:l.querySelector('[data-field="name"]'),w=l==null?void 0:l.querySelector('[data-field="role"]');C&&(C.textContent=e.meta.staff_name??"",C.style.color=d.text),w&&(w.textContent=e.meta.role_name??"",w.style.color=d.text)}document.getElementById("board-canvas").appendChild(t)}}let N=null,_=null,Me=0,Oe=0,te=null,xe=0,be=0;function de(e){e.addEventListener("mousedown",i=>nt(i,e)),e.addEventListener("touchstart",i=>nt(i,e),{passive:!1}),e.addEventListener("mouseenter",()=>{const i=e.querySelector(".zone-edit-btn");i&&(i.style.display="flex");const s=e.querySelector(".zone-copy-btn");s&&(s.style.display="flex");const d=e.querySelector(".zone-delete-btn");d&&(d.style.display="block");const l=e.querySelector(".zone-resize-handle");l&&(l.style.display="block")}),e.addEventListener("mouseleave",()=>{const i=e.querySelector(".zone-edit-btn");i&&(i.style.display="none");const s=e.querySelector(".zone-copy-btn");s&&(s.style.display="none");const d=e.querySelector(".zone-delete-btn");d&&(d.style.display="none");const l=e.querySelector(".zone-resize-handle");l&&(l.style.display="none")});const t=e.querySelector(".zone-edit-btn");t&&(t.addEventListener("mousedown",i=>i.stopPropagation()),t.addEventListener("click",i=>{i.stopPropagation(),Xo(e)}));const o=e.querySelector(".zone-copy-btn");o&&(o.addEventListener("mousedown",i=>i.stopPropagation()),o.addEventListener("click",i=>{i.stopPropagation(),Ao(e)}));const n=e.querySelector(".zone-delete-btn");n&&(n.addEventListener("mousedown",i=>i.stopPropagation()),n.addEventListener("click",i=>{i.stopPropagation(),confirm("このグループを削除しますか？")&&fetch("/board/zone/"+e.dataset.zoneId,{method:"DELETE",headers:{"X-CSRF-TOKEN":c}}).then(s=>s.json()).then(()=>e.remove())}));const a=e.querySelector(".zone-resize-handle");a&&(a.addEventListener("mousedown",i=>it(i,e)),a.addEventListener("touchstart",i=>it(i,e),{passive:!1})),J(e)}function nt(e,t){if(e.target.classList.contains("zone-edit-btn")||e.target.classList.contains("zone-copy-btn")||e.target.classList.contains("zone-delete-btn"))return;N&&(N.style.opacity="1",N=null),_&&(_.remove(),_=null);const o=e.touches?e.touches[0].clientX:e.clientX,n=e.touches?e.touches[0].clientY:e.clientY;te=t,xe=o,be=n,document.addEventListener("mousemove",Be),document.addEventListener("mouseup",Re)}function Be(e){const t=e.clientX-xe,o=e.clientY-be;(Math.abs(t)>4||Math.abs(o)>4)&&(document.removeEventListener("mousemove",Be),document.removeEventListener("mouseup",Re),Ro(te,xe,be),te=null)}function Re(){document.removeEventListener("mousemove",Be),document.removeEventListener("mouseup",Re),te=null}function Ro(e,t,o){N=e;const n=e.getBoundingClientRect();Me=t-n.left,Oe=o-n.top,_=e.cloneNode(!0),_.style.cssText=`
        position:fixed;pointer-events:none;z-index:9998;opacity:0.7;
        left:${n.left}px;top:${n.top}px;
        width:${n.width}px;height:${n.height}px;
    `,document.body.appendChild(_),e.style.opacity="0.3",document.addEventListener("mousemove",$t),document.addEventListener("mouseup",Bt),document.addEventListener("touchmove",Mt,{passive:!1}),document.addEventListener("touchend",Rt)}function $t(e){Ot(e.clientX,e.clientY)}function Mt(e){e.preventDefault(),Ot(e.touches[0].clientX,e.touches[0].clientY)}function Ot(e,t){_.style.left=e-Me+"px",_.style.top=t-Oe+"px"}function Bt(e){Xt(e.clientX,e.clientY)}function Rt(e){Xt(e.changedTouches[0].clientX,e.changedTouches[0].clientY)}function Xt(e,t){document.removeEventListener("mousemove",$t),document.removeEventListener("mouseup",Bt),document.removeEventListener("touchmove",Mt),document.removeEventListener("touchend",Rt),_.remove(),_=null;const o=p.getBoundingClientRect(),n=N,a=n.dataset.zoneId;let i=e-o.left+p.scrollLeft-Me,s=t-o.top+p.scrollTop-Oe;i=Math.max(0,Math.min(i,Y-n.offsetWidth)),s=Math.max(0,Math.min(s,D-n.offsetHeight)),n.style.left=i+"px",n.style.top=s+"px",n.style.opacity="1",N=null,fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":c},body:JSON.stringify({whiteboard_id:u,item_type:"zone",item_id:parseInt(a),pos_x:i,pos_y:s,meta:{color_index:parseInt(n.dataset.colorIndex??0),label:n.dataset.label??"",width:n.offsetWidth,height:n.offsetHeight}})})}let g=null,Ft=0,Pt=0,At=0,Nt=0;function it(e,t){e.stopPropagation(),e.preventDefault(),g=t,Ft=e.touches?e.touches[0].clientX:e.clientX,Pt=e.touches?e.touches[0].clientY:e.clientY,At=t.offsetWidth,Nt=t.offsetHeight,document.addEventListener("mousemove",jt),document.addEventListener("mouseup",Ht),document.addEventListener("touchmove",Yt,{passive:!1}),document.addEventListener("touchend",Kt)}function jt(e){Dt(e.clientX,e.clientY)}function Yt(e){e.preventDefault(),Dt(e.touches[0].clientX,e.touches[0].clientY)}function Dt(e,t){g&&(g.style.width=Math.max(100,At+(e-Ft))+"px",g.style.height=Math.max(80,Nt+(t-Pt))+"px")}function Ht(e){Wt()}function Kt(e){Wt()}function Wt(){document.removeEventListener("mousemove",jt),document.removeEventListener("mouseup",Ht),document.removeEventListener("touchmove",Yt),document.removeEventListener("touchend",Kt),g&&(fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":c},body:JSON.stringify({whiteboard_id:u,item_type:"zone",item_id:parseInt(g.dataset.zoneId),pos_x:parseFloat(g.style.left)||0,pos_y:parseFloat(g.style.top)||0,meta:{color_index:parseInt(g.dataset.colorIndex??0),label:g.dataset.label??"",width:g.offsetWidth,height:g.offsetHeight}})}),g=null)}let x=null,j=0;const T=document.createElement("div");T.id="zone-edit-modal";T.style.cssText=`
    display:none;position:fixed;inset:0;z-index:99999;
    background:rgba(0,0,0,0.4);
    align-items:center;justify-content:center;
`;T.innerHTML=`
    <div style="background:white;border-radius:12px;padding:24px;width:400px;">
        <p style="font-size:15px;font-weight:500;margin-bottom:16px;">グループを編集</p>
        <div style="margin-bottom:16px;">
            <label style="font-size:12px;color:#6b7280;display:block;margin-bottom:4px;">名称</label>
            <input id="zone-edit-label" type="text" autocomplete="off"
                   style="width:100%;font-size:14px;border:1px solid #d1d5db;border-radius:6px;padding:6px 10px;">
        </div>
        <div style="margin-bottom:20px;">
            <label style="font-size:12px;color:#6b7280;display:block;margin-bottom:8px;">色</label>
            <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;width:180px;">
                ${se.map((e,t)=>`
                    <div class="zone-color-chip" data-color-index="${t}"
                        style="height:32px;border-radius:6px;cursor:pointer;
                                background:${e.bg};border:2px solid ${e.border};">
                    </div>
                `).join("")}
            </div>
        </div>
        <div style="display:flex;justify-content:flex-end;align-items:center;">
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
`;document.body.appendChild(T);T.querySelectorAll(".zone-color-chip").forEach(e=>{e.addEventListener("click",()=>{j=parseInt(e.dataset.colorIndex),T.querySelectorAll(".zone-color-chip").forEach(t=>{t.style.outline="none",t.style.transform="scale(1)"}),e.style.outline="2px solid #374151",e.style.outlineOffset="2px",e.style.transform="scale(1.2)"})});document.getElementById("zone-edit-cancel").addEventListener("click",()=>{T.style.display="none"});document.getElementById("zone-edit-save").addEventListener("click",()=>{const e=document.getElementById("zone-edit-label").value.trim();if(!e)return;const t=se[j];fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":c},body:JSON.stringify({whiteboard_id:u,item_type:"zone",item_id:parseInt(x.dataset.zoneId),pos_x:parseFloat(x.style.left)||0,pos_y:parseFloat(x.style.top)||0,meta:{color_index:j,label:e,width:parseFloat(x.style.width)||x.offsetWidth,height:parseFloat(x.style.height)||x.offsetHeight}})}),x.style.borderColor=t.border,x.style.background=t.bg,x.dataset.colorIndex=j,x.dataset.label=e;const o=x.querySelector(".zone-label-text");o&&(o.textContent=e,o.style.color=t.text),T.style.display="none"});function Xo(e){x=e,j=parseInt(e.dataset.colorIndex??0),document.getElementById("zone-edit-label").value=e.dataset.label??"",T.querySelectorAll(".zone-color-chip").forEach(t=>{const o=parseInt(t.dataset.colorIndex)===j;t.style.outline=o?"2px solid #374151":"none",t.style.outlineOffset="2px",t.style.transform=o?"scale(1.2)":"scale(1)"}),T.style.display="flex"}function Fo(){const e=document.getElementById("newZoneLabel").value.trim();e&&fetch("/board/zone",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":c},body:JSON.stringify({whiteboard_id:u,label:e,color_index:0})}).then(t=>t.json()).then(t=>{const o=t.item,n=Xe(o);document.getElementById("board-canvas").appendChild(n),de(n),document.getElementById("newZoneLabel").value=""})}function Xe(e){const t=e.meta??{},o=se[t.color_index??0],n=document.createElement("div");return n.className="zone magnet-zone cursor-grab select-none absolute border-2 rounded-xl",n.dataset.zoneId=e.whiteboard_item_id,n.dataset.colorIndex=t.color_index??0,n.dataset.label=t.label??"",n.style.cssText=`
        left:${e.pos_x??40}px;top:${e.pos_y??40}px;
        width:${t.width??180}px;height:${t.height??280}px;
        border-color:${o.border};background:${o.bg};
    `,n.innerHTML=Po(t.label??"",o),n}function Po(e,t){return`
        <span class="zone-label-text absolute -top-3 left-2 text-xs font-medium px-1 rounded pointer-events-none select-none"
              style="color:${t.text};background:#f7f6f0;">${e}</span>
        <div class="zone-edit-btn" data-tippy-content="編集" style="display:none;position:absolute;top:-7px;right:-7px;
            width:18px;height:18px;border-radius:50%;background:#374151;color:white;font-size:10px;
            align-items:center;justify-content:center;cursor:pointer;z-index:10;">✏</div>
        <div class="zone-copy-btn" data-tippy-content="複製" style="display:none;position:absolute;top:-7px;right:14px;
            width:18px;height:18px;border-radius:50%;background:#374151;color:white;font-size:10px;
            align-items:center;justify-content:center;cursor:pointer;z-index:10;">📋</div>
        <div class="zone-delete-btn" data-tippy-content="削除" style="display:none;position:absolute;top:-7px;left:-7px;
            width:18px;height:18px;border-radius:50%;background:#ef4444;color:white;font-size:12px;
            line-height:18px;text-align:center;cursor:pointer;z-index:10;">×</div>
        <div class="zone-resize-handle" data-tippy-content="サイズ変更" style="display:none;position:absolute;bottom:-4px;right:-4px;
            width:14px;height:14px;border-radius:2px;color:#374151;font-size:18px;line-height:14px;
            text-align:center;cursor:se-resize;z-index:10;user-select:none;">⤡</div>
    `}function Ao(e){fetch("/board/zone",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":c},body:JSON.stringify({whiteboard_id:u,label:e.dataset.label,color_index:parseInt(e.dataset.colorIndex??0)})}).then(t=>t.json()).then(t=>{const o=t.item;H!==e&&(k(0),Z(e)),k(f+20);const n=(parseFloat(e.style.left)||0)+f,a=(parseFloat(e.style.top)||0)+f;o.pos_x=n,o.pos_y=a,o.meta.width=e.offsetWidth,o.meta.height=e.offsetHeight;const i=Xe(o);i.querySelectorAll(".zone-edit-btn, .zone-copy-btn").forEach(s=>s.style.display="none"),i.querySelectorAll(".zone-resize-handle").forEach(s=>s.style.display="none"),document.getElementById("board-canvas").appendChild(i),de(i),fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":c},body:JSON.stringify({whiteboard_id:u,item_type:"zone",item_id:parseInt(o.whiteboard_item_id),pos_x:n,pos_y:a,meta:o.meta})})})}function No(e){if(document.querySelector(`.magnet-zone[data-zone-id="${e.whiteboard_item_id}"]`))return;const t=Xe(e);document.getElementById("board-canvas").appendChild(t),de(t)}function jo(e){const t=document.querySelector(`.magnet-zone[data-zone-id="${e.zoneId}"]`);t&&t.remove()}function Yo(e){var o,n,a,i;const t=document.querySelector(`.magnet-zone[data-zone-id="${e.itemId}"]`);if(t){if(t.style.left=e.posX+"px",t.style.top=e.posY+"px",(o=e.meta)!=null&&o.width&&(t.style.width=e.meta.width+"px"),(n=e.meta)!=null&&n.height&&(t.style.height=e.meta.height+"px"),((a=e.meta)==null?void 0:a.colorIndex)!==void 0){const s=se[e.meta.colorIndex];t.style.borderColor=s.border,t.style.background=s.bg}if((i=e.meta)!=null&&i.label){const s=t.querySelector(".zone-label-text");s&&(s.textContent=e.meta.label)}}}function Fe(e){const t=e.meta??{},o=document.createElement("div");return o.className="text-box absolute cursor-grab select-none",o.dataset.textId=e.whiteboard_item_id,o.style.cssText=`
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
        <div class="text-edit-btn" data-tippy-content="編集" style="
            display:none;position:absolute;top:-7px;right:-7px;
            width:18px;height:18px;border-radius:50%;
            background:#374151;color:white;font-size:10px;
            align-items:center;justify-content:center;
            cursor:pointer;z-index:10;">✏</div>
        <div class="text-copy-btn" data-tippy-content="複製" style="
            display:none;position:absolute;top:-7px;right:14px;
            width:18px;height:18px;border-radius:50%;
            background:#374151;color:white;font-size:10px;line-height:18px;
            text-align:center;cursor:pointer;z-index:10;">📋</div>
        <div class="text-delete-btn" data-tippy-content="削除" style="
            display:none;position:absolute;top:-7px;left:-7px;
            width:18px;height:18px;border-radius:50%;
            background:#ef4444;color:white;font-size:12px;line-height:18px;
            text-align:center;cursor:pointer;z-index:10;">×</div>
        <div class="text-resize-handle" data-tippy-content="サイズ変更" style="
            display:none;position:absolute;bottom:-4px;right:-4px;
            width:14px;height:14px;border-radius:2px;
            color:#374151;font-size:18px;line-height:14px;text-align:center;
            cursor:se-resize;z-index:10;user-select:none;">⤡</div>
    `,o}function le(e){e.addEventListener("mousedown",i=>st(i,e)),e.addEventListener("touchstart",i=>st(i,e),{passive:!1}),e.addEventListener("mouseenter",()=>{e.querySelector(".text-edit-btn").style.display="flex",e.querySelector(".text-delete-btn").style.display="block",e.querySelector(".text-copy-btn").style.display="block",e.querySelector(".text-resize-handle").style.display="block";const i=e.querySelector(".text-box-inner");i.contentEditable!=="true"&&(i.style.borderColor="#d1d5db")}),e.addEventListener("mouseleave",()=>{e.querySelector(".text-edit-btn").style.display="none",e.querySelector(".text-delete-btn").style.display="none",e.querySelector(".text-copy-btn").style.display="none",e.querySelector(".text-resize-handle").style.display="none";const i=e.querySelector(".text-box-inner");i.contentEditable!=="true"&&(i.style.borderColor="transparent")}),e.querySelector(".text-box-inner").addEventListener("dblclick",i=>{i.stopPropagation(),at(e)});const t=e.querySelector(".text-edit-btn");t.addEventListener("mousedown",i=>i.stopPropagation()),t.addEventListener("click",i=>{i.stopPropagation(),at(e)});const o=e.querySelector(".text-delete-btn");o.addEventListener("mousedown",i=>i.stopPropagation()),o.addEventListener("click",i=>{i.stopPropagation(),confirm("このテキストを削除しますか？")&&fetch("/board/text/"+e.dataset.textId,{method:"DELETE",headers:{"X-CSRF-TOKEN":c}}).then(s=>s.json()).then(()=>e.remove())});const n=e.querySelector(".text-copy-btn");n.addEventListener("mousedown",i=>i.stopPropagation()),n.addEventListener("click",i=>{i.stopPropagation(),Ko(e)});const a=e.querySelector(".text-resize-handle");a.addEventListener("mousedown",i=>rt(i,e)),a.addEventListener("touchstart",i=>rt(i,e),{passive:!1}),J(e)}function at(e){const t=e.querySelector(".text-box-inner"),o=t.textContent,n=t.style.backgroundColor||"transparent";t.contentEditable="true",t.style.cursor="text",t.style.borderColor="transparent",t.focus();const a=document.createRange();a.selectNodeContents(t),a.collapse(!1);const i=window.getSelection();i.removeAllRanges(),i.addRange(a);const s=document.createElement("div");s.className="text-toolbar",s.style.cssText=`
        position:absolute;bottom:-36px;left:0;
        display:flex;align-items:center;gap:4px;
        background:white;border:1px solid #d1d5db;border-radius:6px;
        padding:4px 6px;z-index:20;box-shadow:0 2px 6px rgba(0,0,0,0.1);
    `;const d=parseInt(t.style.fontSize)||14,l=t.style.color||"#374151",h=t.style.fontWeight==="700"||t.style.fontWeight==="bold",E=t.style.fontFamily||"'Kosugi Maru', sans-serif";s.innerHTML=`
        <select class="tb-font" data-tippy-content="フォント" style="font-size:11px;border:1px solid #e5e7eb;border-radius:4px;padding:2px 4px;width:140px;">
            <option value="'Kosugi Maru', sans-serif" style="font-family:'Kosugi Maru',sans-serif" ${E.includes("Kosugi Maru")?"selected":""}>Kosugi Maru</option>
            <option value="'Sawarabi Mincho', serif" style="font-family:'Sawarabi Mincho',serif" ${E.includes("Sawarabi Mincho")?"selected":""}>Sawarabi Mincho</option>
            <option value="'Zen Maru Gothic', sans-serif" style="font-family:'Zen Maru Gothic',sans-serif" ${E.includes("Zen Maru Gothic")?"selected":""}>Zen Maru Gothic</option>
            <option value="'Kiwi Maru', serif" style="font-family:'Kiwi Maru',serif" ${E.includes("Kiwi Maru")?"selected":""}>Kiwi Maru</option>
            <option value="'Hachi Maru Pop', cursive" style="font-family:'Hachi Maru Pop',cursive" ${E.includes("Hachi Maru Pop")?"selected":""}>Hachi Maru Pop</option>
            <option value="'Potta One', cursive" style="font-family:'Potta One',cursive" ${E.includes("Potta One")?"selected":""}>Potta One</option>
        </select>
        <select class="tb-size" data-tippy-content="フォントサイズ" style="font-size:11px;border:1px solid #e5e7eb;border-radius:4px;padding:2px 4px;">
            ${[10,12,14,16,18,20,24,28,32,40].map(r=>`<option value="${r}" ${r===d?"selected":""}>${r}px</option>`).join("")}
        </select>
        <div class="tb-color-wrap" style="position:relative;">
            <button class="tb-color-btn" data-tippy-content="文字色" style="
                width:24px;height:24px;border:1px solid #e5e7eb;border-radius:4px;
                cursor:pointer;font-size:14px;font-weight:700;line-height:24px;
                text-align:center;background:white;color:${l};">A</button>
            <div class="tb-color-palette" style="
                display:none;position:absolute;top:-112px;left:0;
                background:white;border:1px solid #d1d5db;border-radius:6px;
                padding:4px;box-shadow:0 2px 6px rgba(0,0,0,0.15);z-index:30;">
                <div style="display:flex;flex-wrap:wrap;gap:3px;width:${10*23}px;">
                    ${Q.map(r=>`
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
                        ${Q.map(r=>`
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
    `,e.appendChild(s),tippy(s.querySelectorAll("[data-tippy-content]"),{duration:500,maxWidth:"none",allowHTML:!0,placement:"top",theme:"tippy_main_theme"}),s.addEventListener("mousedown",r=>{r.stopPropagation(),r.target.closest("select")||r.preventDefault()}),s.querySelector(".tb-font").addEventListener("change",r=>{t.style.fontFamily=r.target.value}),s.querySelector(".tb-size").addEventListener("change",r=>{t.style.fontSize=r.target.value+"px"}),s.querySelector(".tb-bold").addEventListener("click",r=>{const P=t.style.fontWeight==="700";t.style.fontWeight=P?"400":"700",r.target.style.borderColor=P?"#e5e7eb":"#374151",r.target.style.background=P?"transparent":"#f3f4f6"}),s.querySelectorAll(".tb-align").forEach(r=>{r.dataset.align===(t.style.textAlign||"left")&&(r.style.borderColor="#374151",r.style.background="#f3f4f6"),r.addEventListener("click",()=>{t.style.textAlign=r.dataset.align,s.querySelectorAll(".tb-align").forEach(P=>{P.style.borderColor="#e5e7eb",P.style.background="transparent"}),r.style.borderColor="#374151",r.style.background="#f3f4f6"})});const C=s.querySelector(".tb-color-btn"),w=s.querySelector(".tb-color-palette");C.addEventListener("click",()=>{w.style.display=w.style.display==="none"?"block":"none",s.querySelector(".tb-bg-palette").style.display="none"}),s.querySelectorAll(".tb-color-chip").forEach(r=>{r.addEventListener("click",()=>{t.style.color=r.dataset.color,C.style.color=r.dataset.color,w.style.display="none",t.focus()})});const et=s.querySelector(".tb-bg-btn"),he=s.querySelector(".tb-bg-palette");et.addEventListener("click",()=>{he.style.display=he.style.display==="none"?"block":"none",w.style.display="none"}),s.querySelectorAll(".tb-bg-chip").forEach(r=>{r.addEventListener("click",()=>{t.style.backgroundColor=r.dataset.color,t.dataset.bgColor=r.dataset.color,et.style.backgroundColor=r.dataset.color,he.style.display="none",t.focus()})});function To(){t.removeEventListener("blur",ye),t.contentEditable="false",t.style.cursor="inherit",t.style.borderColor="transparent",s.remove(),fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":c},body:JSON.stringify({whiteboard_id:u,item_type:"text",item_id:parseInt(e.dataset.textId),pos_x:parseFloat(e.style.left)||0,pos_y:parseFloat(e.style.top)||0,meta:{text:t.innerText.trim(),font_size:parseInt(t.style.fontSize)||14,color:t.style.color||"#374151",font_weight:t.style.fontWeight||"400",font_family:(t.style.fontFamily||"'Kosugi Maru', sans-serif").replace(/"/g,"'"),text_align:t.style.textAlign||"left",bg_color:t.dataset.bgColor||"transparent",width:e.offsetWidth,height:e.offsetHeight}})})}function ye(r){if(s.contains(r.relatedTarget)){t.focus();return}t.style.borderColor="transparent",setTimeout(()=>{t.contentEditable==="true"&&To()},50)}t.addEventListener("blur",ye),t.addEventListener("keydown",r=>{r.key==="Escape"&&(t.removeEventListener("blur",ye),t.textContent=o,t.contentEditable="false",t.style.cursor="inherit",t.style.borderColor="transparent",s.remove())})}let ge=null,R=null,Pe=0,Ae=0,oe=null,ve=0,Ee=0;function st(e,t){if(e.target.classList.contains("text-edit-btn")||e.target.classList.contains("text-delete-btn")||e.target.classList.contains("text-copy-btn")||e.target.classList.contains("text-resize-handle")||e.target.contentEditable==="true")return;const o=e.touches?e.touches[0].clientX:e.clientX,n=e.touches?e.touches[0].clientY:e.clientY;oe=t,ve=o,Ee=n,document.addEventListener("mousemove",Ne),document.addEventListener("mouseup",je)}function Ne(e){const t=e.clientX-ve,o=e.clientY-Ee;(Math.abs(t)>4||Math.abs(o)>4)&&(document.removeEventListener("mousemove",Ne),document.removeEventListener("mouseup",je),Do(oe,ve,Ee),oe=null)}function je(){document.removeEventListener("mousemove",Ne),document.removeEventListener("mouseup",je),oe=null}function Do(e,t,o){ge=e;const n=e.getBoundingClientRect();Pe=t-n.left,Ae=o-n.top,R=e.cloneNode(!0),R.style.cssText+=`position:fixed;pointer-events:none;z-index:9998;opacity:0.7;
        left:${n.left}px;top:${n.top}px;width:${n.width}px;`,document.body.appendChild(R),e.style.opacity="0.3",document.addEventListener("mousemove",Zt),document.addEventListener("mouseup",Jt)}function Zt(e){R.style.left=e.clientX-Pe+"px",R.style.top=e.clientY-Ae+"px"}function Jt(e){document.removeEventListener("mousemove",Zt),document.removeEventListener("mouseup",Jt),R.remove(),R=null;const t=p.getBoundingClientRect(),o=ge;let n=e.clientX-t.left+p.scrollLeft-Pe,a=e.clientY-t.top+p.scrollTop-Ae;n=Math.max(0,Math.min(n,Y-o.offsetWidth)),a=Math.max(0,Math.min(a,D-o.offsetHeight)),o.style.left=n+"px",o.style.top=a+"px",o.style.opacity="1",ge=null;const i=o.querySelector(".text-box-inner");fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":c},body:JSON.stringify({whiteboard_id:u,item_type:"text",item_id:parseInt(o.dataset.textId),pos_x:n,pos_y:a,meta:{text:i.innerText,font_size:parseInt(i.style.fontSize)||14,color:i.style.color||"#374151",font_weight:i.style.fontWeight||"400",font_family:(i.style.fontFamily||"'Kosugi Maru', sans-serif").replace(/"/g,"'"),text_align:i.style.textAlign||"left",bg_color:i.dataset.bgColor||"transparent",width:o.offsetWidth,height:o.offsetHeight}})})}let m=null,Ut=0,Gt=0,Vt=0,Qt=0;function rt(e,t){e.stopPropagation(),e.preventDefault(),m=t,Ut=e.touches?e.touches[0].clientX:e.clientX,Gt=e.touches?e.touches[0].clientY:e.clientY,Vt=t.offsetWidth,Qt=t.offsetHeight,document.addEventListener("mousemove",eo),document.addEventListener("mouseup",to)}function eo(e){if(!m)return;m.style.width=Math.max(100,Vt+(e.clientX-Ut))+"px",m.style.height=Math.max(50,Qt+(e.clientY-Gt))+"px";const t=m.querySelector(".text-box-inner");t&&(t.style.minHeight=m.style.height)}function to(){if(document.removeEventListener("mousemove",eo),document.removeEventListener("mouseup",to),!m)return;const e=m.querySelector(".text-box-inner");fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":c},body:JSON.stringify({whiteboard_id:u,item_type:"text",item_id:parseInt(m.dataset.textId),pos_x:parseFloat(m.style.left)||0,pos_y:parseFloat(m.style.top)||0,meta:{text:e.innerText,font_size:parseInt(e.style.fontSize)||14,color:e.style.color||"#374151",font_weight:e.style.fontWeight||"400",font_family:(e.style.fontFamily||"'Kosugi Maru', sans-serif").replace(/"/g,"'"),text_align:e.style.textAlign||"left",bg_color:e.dataset.bgColor||"transparent",width:m.offsetWidth,height:m.offsetHeight}})}),m=null}function Ho(){fetch("/board/text",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":c},body:JSON.stringify({whiteboard_id:u,text:"テキスト"})}).then(e=>e.json()).then(e=>{const t=Fe(e.item);document.getElementById("board-canvas").appendChild(t),le(t)})}function Ko(e){const t=e.querySelector(".text-box-inner");fetch("/board/text",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":c},body:JSON.stringify({whiteboard_id:u,text:t.innerText.trim()})}).then(o=>o.json()).then(o=>{const n=o.item;n.meta={...n.meta,font_size:parseInt(t.style.fontSize)||14,color:t.style.color||"#374151",font_weight:t.style.fontWeight||"400",font_family:(t.style.fontFamily||"'Kosugi Maru', sans-serif").replace(/"/g,"'"),text_align:t.style.textAlign||"left",bg_color:t.dataset.bgColor||"transparent",width:e.offsetWidth,height:e.offsetHeight},H!==e&&(k(0),Z(e)),k(f+20),n.pos_x=(parseFloat(e.style.left)||0)+f,n.pos_y=(parseFloat(e.style.top)||0)+f;const a=Fe(n);a.querySelectorAll(".text-edit-btn, .text-copy-btn, .text-delete-btn").forEach(i=>i.style.display="none"),a.querySelectorAll(".text-resize-handle").forEach(i=>i.style.display="none"),document.getElementById("board-canvas").appendChild(a),le(a),fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":c},body:JSON.stringify({whiteboard_id:u,item_type:"text",item_id:parseInt(n.whiteboard_item_id),pos_x:n.pos_x,pos_y:n.pos_y,meta:n.meta})})})}function Wo(e){setTimeout(()=>{if(document.querySelector(`.text-box[data-text-id="${e.whiteboard_item_id}"]`))return;const t=Fe(e);document.getElementById("board-canvas").appendChild(t),le(t)},100)}function Zo(e){const t=document.querySelector(`.text-box[data-text-id="${e.itemId}"]`);t&&t.remove()}function Jo(e){var o,n;const t=document.querySelector(`.text-box[data-text-id="${e.itemId}"]`);t&&(t.style.left=e.posX+"px",t.style.top=e.posY+"px",(o=e.meta)!=null&&o.width&&(t.style.width=e.meta.width+"px"),(n=e.meta)!=null&&n.height&&(t.style.height=e.meta.height+"px"))}function Ye(e,t,o,n){switch(e){case"rect":return`<rect x="2" y="2" width="96" height="96"
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
                    vector-effect="non-scaling-stroke"/>`;default:return""}}function De(e){const t=e.meta??{},o=t.shape_type??"rect",n=t.fill_color??"#93c5fd",a=t.stroke_color??"#2563eb",i=t.rotation??0,s=document.createElement("div");return s.className="shape-box absolute cursor-grab select-none",s.dataset.shapeId=e.whiteboard_item_id,s.dataset.shapeType=o,s.dataset.fillColor=n,s.dataset.strokeColor=a,s.dataset.rotation=i,s.style.cssText=`
        left:${e.pos_x}px;top:${e.pos_y}px;
        width:${t.width??120}px;height:${t.height??120}px;
        position:absolute;
        transform:rotate(${i}deg);
    `,s.innerHTML=`
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style="overflow:visible;">
            ${Ye(o,n,a,e.whiteboard_item_id)}
        </svg>
        <div class="shape-delete-btn" data-tippy-content="削除" style="display:none;position:absolute;top:-7px;left:-7px;
            width:18px;height:18px;border-radius:50%;background:#ef4444;color:white;font-size:12px;
            line-height:18px;text-align:center;cursor:pointer;z-index:10;">×</div>
        <div class="shape-copy-btn" data-tippy-content="複製" style="display:none;position:absolute;top:-7px;right:14px;
            width:18px;height:18px;border-radius:50%;background:#374151;color:white;font-size:10px;
            line-height:18px;text-align:center;cursor:pointer;z-index:10;">📋</div>
        <div class="shape-color-btn" data-tippy-content="色変更" style="display:none;position:absolute;top:-7px;right:-7px;
            width:18px;height:18px;border-radius:50%;background:#374151;color:white;font-size:10px;
            line-height:18px;text-align:center;cursor:pointer;z-index:10;">🎨</div>
        <div class="shape-resize-handle" data-tippy-content="サイズ変更" style="display:none;position:absolute;bottom:-4px;right:-4px;
            width:14px;height:14px;border-radius:2px;color:#374151;font-size:18px;line-height:14px;
            text-align:center;cursor:se-resize;z-index:10;user-select:none;">⤡</div>
        <div class="shape-rotate-handle" data-tippy-content="回転" style="display:none;position:absolute;top:-7px;right:35px;
            width:18px;height:18px;border-radius:50%;background:#374151;color:white;
            font-size:12px;line-height:18px;text-align:center;
            cursor:crosshair;z-index:10;user-select:none;">↻</div>
    `,s}function ce(e){e.addEventListener("mousedown",s=>dt(s,e)),e.addEventListener("touchstart",s=>dt(s,e),{passive:!1}),e.addEventListener("mouseenter",()=>{e.querySelector(".shape-delete-btn").style.display="block",e.querySelector(".shape-copy-btn").style.display="block",e.querySelector(".shape-color-btn").style.display="block",e.querySelector(".shape-resize-handle").style.display="block",e.querySelector(".shape-rotate-handle").style.display="block"}),e.addEventListener("mouseleave",s=>{s.relatedTarget&&s.relatedTarget.classList.contains("shape-rotate-handle")||(e.querySelector(".shape-delete-btn").style.display="none",e.querySelector(".shape-copy-btn").style.display="none",e.querySelector(".shape-color-btn").style.display="none",e.querySelector(".shape-resize-handle").style.display="none",e.querySelector(".shape-rotate-handle").style.display="none")});const t=e.querySelector(".shape-delete-btn");t.addEventListener("mousedown",s=>s.stopPropagation()),t.addEventListener("click",s=>{s.stopPropagation(),confirm("この図形を削除しますか？")&&fetch("/board/shape/"+e.dataset.shapeId,{method:"DELETE",headers:{"X-CSRF-TOKEN":c}}).then(d=>d.json()).then(()=>e.remove())});const o=e.querySelector(".shape-copy-btn");o.addEventListener("mousedown",s=>s.stopPropagation()),o.addEventListener("click",s=>{s.stopPropagation(),Qo(e)});const n=e.querySelector(".shape-color-btn");n.addEventListener("mousedown",s=>s.stopPropagation()),n.addEventListener("click",s=>{s.stopPropagation(),Vo(e)});const a=e.querySelector(".shape-resize-handle");a.addEventListener("mousedown",s=>lt(s,e)),a.addEventListener("touchstart",s=>lt(s,e),{passive:!1});const i=e.querySelector(".shape-rotate-handle");i.addEventListener("mouseleave",s=>{z||s.relatedTarget&&(s.relatedTarget===e||e.contains(s.relatedTarget))||(e.querySelector(".shape-delete-btn").style.display="none",e.querySelector(".shape-copy-btn").style.display="none",e.querySelector(".shape-color-btn").style.display="none",e.querySelector(".shape-resize-handle").style.display="none",i.style.display="none")}),i.addEventListener("mousedown",s=>Go(s,e)),J(e)}let we=null,X=null,He=0,Ke=0,ne=null,Se=0,ze=0;function dt(e,t){if(e.target.classList.contains("shape-delete-btn")||e.target.classList.contains("shape-copy-btn")||e.target.classList.contains("shape-color-btn")||e.target.classList.contains("shape-resize-handle")||e.target.classList.contains("shape-rotate-handle"))return;const o=e.touches?e.touches[0].clientX:e.clientX,n=e.touches?e.touches[0].clientY:e.clientY;ne=t,Se=o,ze=n,document.addEventListener("mousemove",We),document.addEventListener("mouseup",Ze)}function We(e){const t=e.clientX-Se,o=e.clientY-ze;(Math.abs(t)>4||Math.abs(o)>4)&&(document.removeEventListener("mousemove",We),document.removeEventListener("mouseup",Ze),Uo(ne,Se,ze),ne=null)}function Ze(){document.removeEventListener("mousemove",We),document.removeEventListener("mouseup",Ze),ne=null}function Uo(e,t,o){we=e;const n=e.getBoundingClientRect();He=t-n.left,Ke=o-n.top,X=e.cloneNode(!0),X.style.cssText+=`position:fixed;pointer-events:none;z-index:9998;opacity:0.7;
        left:${n.left}px;top:${n.top}px;width:${n.width}px;`,document.body.appendChild(X),e.style.opacity="0.3",document.addEventListener("mousemove",oo),document.addEventListener("mouseup",no)}function oo(e){X.style.left=e.clientX-He+"px",X.style.top=e.clientY-Ke+"px"}function no(e){document.removeEventListener("mousemove",oo),document.removeEventListener("mouseup",no),X.remove(),X=null;const t=p.getBoundingClientRect(),o=we;let n=e.clientX-t.left+p.scrollLeft-He,a=e.clientY-t.top+p.scrollTop-Ke;n=Math.max(0,Math.min(n,Y-o.offsetWidth)),a=Math.max(0,Math.min(a,D-o.offsetHeight)),o.style.left=n+"px",o.style.top=a+"px",o.style.opacity="1",we=null,pe(o,n,a)}function pe(e,t,o){fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":c},body:JSON.stringify({whiteboard_id:u,item_type:"shape",item_id:parseInt(e.dataset.shapeId),pos_x:t,pos_y:o,meta:{shape_type:e.dataset.shapeType,fill_color:e.dataset.fillColor,stroke_color:e.dataset.strokeColor,rotation:parseInt(e.dataset.rotation)||0,width:e.offsetWidth,height:e.offsetHeight}})})}let $=null,io=0,ao=0,so=0,ro=0;function lt(e,t){e.stopPropagation(),e.preventDefault(),$=t,io=e.touches?e.touches[0].clientX:e.clientX,ao=e.touches?e.touches[0].clientY:e.clientY,so=t.offsetWidth,ro=t.offsetHeight,document.addEventListener("mousemove",lo),document.addEventListener("mouseup",co)}function lo(e){$&&($.style.width=Math.max(20,so+(e.clientX-io))+"px",$.style.height=Math.max(20,ro+(e.clientY-ao))+"px")}function co(){document.removeEventListener("mousemove",lo),document.removeEventListener("mouseup",co),$&&(pe($,parseFloat($.style.left)||0,parseFloat($.style.top)||0),$=null)}let z=null,po=0,uo=0;function Go(e,t){e.stopPropagation(),e.preventDefault(),z=t;const o=t.getBoundingClientRect();po=o.left+o.width/2,uo=o.top+o.height/2,parseInt(t.dataset.rotation),document.addEventListener("mousemove",ho),document.addEventListener("mouseup",yo)}function ho(e){if(!z)return;const t=e.clientX-po,o=e.clientY-uo,n=Math.round(Math.atan2(o,t)*(180/Math.PI)+90);z.style.transform=`rotate(${n}deg)`,z.dataset.rotation=n}function yo(){document.removeEventListener("mousemove",ho),document.removeEventListener("mouseup",yo),z&&(pe(z,parseFloat(z.style.left)||0,parseFloat(z.style.top)||0),z=null)}const v=document.createElement("div");v.id="shape-color-modal";v.style.cssText=`
    display:none;position:fixed;inset:0;z-index:99999;
    background:rgba(0,0,0,0.4);
    align-items:center;justify-content:center;
`;v.innerHTML=`
    <div style="background:white;border-radius:12px;padding:24px;width:280px;">
        <p style="font-size:15px;font-weight:500;margin-bottom:16px;">色を変更</p>
        <div style="margin-bottom:16px;">
            <label style="font-size:12px;color:#6b7280;display:block;margin-bottom:6px;">塗りつぶし色</label>
            <div id="shape-fill-palette" style="display:flex;flex-wrap:wrap;gap:3px;width:${10*23}px;">
                ${Q.map(e=>`
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
                ${Q.map(e=>`
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
`;document.body.appendChild(v);let I=null;document.getElementById("shape-color-cancel").addEventListener("click",()=>{v.style.display="none"});let K="#93c5fd",W="#2563eb";v.querySelectorAll(".fill-chip").forEach(e=>{e.addEventListener("click",()=>{K=e.dataset.color,v.querySelectorAll(".fill-chip").forEach(t=>{t.style.outline="none",t.style.transform="scale(1)"}),e.style.outline="2px solid #374151",e.style.outlineOffset="2px",e.style.transform="scale(1.2)"})});v.querySelectorAll(".stroke-chip").forEach(e=>{e.addEventListener("click",()=>{W=e.dataset.color,v.querySelectorAll(".stroke-chip").forEach(t=>{t.style.outline="none",t.style.transform="scale(1)"}),e.style.outline="2px solid #374151",e.style.outlineOffset="2px",e.style.transform="scale(1.2)"})});document.getElementById("shape-color-save").addEventListener("click",()=>{I.dataset.fillColor=K,I.dataset.strokeColor=W;const e=I.querySelector("svg");e.innerHTML=Ye(I.dataset.shapeType,K,W,I.dataset.shapeId),pe(I,parseFloat(I.style.left)||0,parseFloat(I.style.top)||0),v.style.display="none"});function Vo(e){I=e,K=e.dataset.fillColor||"#93c5fd",W=e.dataset.strokeColor||"#2563eb",v.querySelectorAll(".fill-chip").forEach(t=>{const o=t.dataset.color===K;t.style.outline=o?"2px solid #374151":"none",t.style.outlineOffset="2px",t.style.transform=o?"scale(1.2)":"scale(1)"}),v.querySelectorAll(".stroke-chip").forEach(t=>{const o=t.dataset.color===W;t.style.outline=o?"2px solid #374151":"none",t.style.outlineOffset="2px",t.style.transform=o?"scale(1.2)":"scale(1)"}),v.style.display="flex"}function Qo(e){fetch("/board/shape",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":c},body:JSON.stringify({whiteboard_id:u,shape_type:e.dataset.shapeType})}).then(t=>t.json()).then(t=>{const o=t.item;H!==e&&(k(0),Z(e)),k(f+20);const n=(parseFloat(e.style.left)||0)+f,a=(parseFloat(e.style.top)||0)+f;o.pos_x=n,o.pos_y=a,o.meta={shape_type:e.dataset.shapeType,fill_color:e.dataset.fillColor,stroke_color:e.dataset.strokeColor,rotation:parseInt(e.dataset.rotation)||0,width:e.offsetWidth,height:e.offsetHeight};const i=De(o);i.querySelectorAll(".shape-delete-btn, .shape-copy-btn, .shape-color-btn").forEach(s=>s.style.display="none"),i.querySelectorAll(".shape-resize-handle, .shape-rotate-handle").forEach(s=>s.style.display="none"),document.getElementById("board-canvas").appendChild(i),ce(i),fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":c},body:JSON.stringify({whiteboard_id:u,item_type:"shape",item_id:parseInt(o.whiteboard_item_id),pos_x:n,pos_y:a,meta:o.meta})})})}function en(e){fetch("/board/shape",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":c},body:JSON.stringify({whiteboard_id:u,shape_type:e})}).then(t=>t.json()).then(t=>{const o=De(t.item);document.getElementById("board-canvas").appendChild(o),ce(o)})}function tn(e){setTimeout(()=>{if(document.querySelector(`.shape-box[data-shape-id="${e.whiteboard_item_id}"]`))return;const t=De(e);document.getElementById("board-canvas").appendChild(t),ce(t)},100)}function on(e){const t=document.querySelector(`.shape-box[data-shape-id="${e.itemId}"]`);t&&t.remove()}function nn(e){var o,n,a,i,s;const t=document.querySelector(`.shape-box[data-shape-id="${e.itemId}"]`);if(t&&(t.style.left=e.posX+"px",t.style.top=e.posY+"px",t.style.transform=`rotate(${((o=e.meta)==null?void 0:o.rotation)??0}deg)`,(n=e.meta)!=null&&n.width&&(t.style.width=e.meta.width+"px"),(a=e.meta)!=null&&a.height&&(t.style.height=e.meta.height+"px"),(i=e.meta)!=null&&i.fillColor||(s=e.meta)!=null&&s.strokeColor)){t.dataset.fillColor=e.meta.fillColor,t.dataset.strokeColor=e.meta.strokeColor;const d=t.querySelector("svg");d.innerHTML=Ye(t.dataset.shapeType,e.meta.fillColor,e.meta.strokeColor,e.itemId)}}function Je(e){const t=e.meta??{},o=document.createElement("div");return o.className="image-box absolute cursor-grab select-none",o.dataset.imageId=e.whiteboard_item_id,o.style.cssText=`
        left:${e.pos_x}px;top:${e.pos_y}px;
        width:${t.width??200}px;height:${t.height??200}px;
        position:absolute;
    `,o.innerHTML=`
        <img src="${t.src}" draggable="false" style="
            width:100%;height:100%;object-fit:contain;
            border-radius:4px;pointer-events:none;
        ">
        <div class="image-delete-btn" data-tippy-content="削除" style="display:none;position:absolute;top:-7px;left:-7px;
            width:18px;height:18px;border-radius:50%;background:#ef4444;color:white;font-size:12px;
            line-height:18px;text-align:center;cursor:pointer;z-index:10;">×</div>
        <div class="image-copy-btn" data-tippy-content="複製" style="display:none;position:absolute;top:-7px;right:-7px;
            width:18px;height:18px;border-radius:50%;background:#374151;color:white;font-size:10px;
            line-height:18px;text-align:center;cursor:pointer;z-index:10;">📋</div>
        <div class="image-resize-handle" data-tippy-content="サイズ変更" style="display:none;position:absolute;bottom:-4px;right:-4px;
            width:14px;height:14px;border-radius:2px;color:#374151;font-size:18px;line-height:14px;
            text-align:center;cursor:se-resize;z-index:10;user-select:none;">⤡</div>
    `,o}function ue(e){e.addEventListener("mousedown",a=>ct(a,e)),e.addEventListener("touchstart",a=>ct(a,e),{passive:!1}),e.addEventListener("mouseenter",()=>{e.querySelector(".image-delete-btn").style.display="block",e.querySelector(".image-copy-btn").style.display="block",e.querySelector(".image-resize-handle").style.display="block"}),e.addEventListener("mouseleave",()=>{e.querySelector(".image-delete-btn").style.display="none",e.querySelector(".image-copy-btn").style.display="none",e.querySelector(".image-resize-handle").style.display="none"});const t=e.querySelector(".image-delete-btn");t.addEventListener("mousedown",a=>a.stopPropagation()),t.addEventListener("click",a=>{a.stopPropagation(),confirm("この画像を削除しますか？")&&fetch("/board/image/"+e.dataset.imageId,{method:"DELETE",headers:{"X-CSRF-TOKEN":c}}).then(i=>i.json()).then(()=>e.remove())});const o=e.querySelector(".image-copy-btn");o.addEventListener("mousedown",a=>a.stopPropagation()),o.addEventListener("click",a=>{a.stopPropagation(),rn(e)});const n=e.querySelector(".image-resize-handle");n.addEventListener("mousedown",a=>pt(a,e)),n.addEventListener("touchstart",a=>pt(a,e),{passive:!1}),J(e)}let Le=null,F=null,Ue=0,Ge=0,ie=null,_e=0,ke=0;function ct(e,t){if(e.target.classList.contains("image-delete-btn")||e.target.classList.contains("image-copy-btn")||e.target.classList.contains("image-resize-handle"))return;const o=e.touches?e.touches[0].clientX:e.clientX,n=e.touches?e.touches[0].clientY:e.clientY;ie=t,_e=o,ke=n,document.addEventListener("mousemove",Ve),document.addEventListener("mouseup",Qe)}function Ve(e){const t=e.clientX-_e,o=e.clientY-ke;(Math.abs(t)>4||Math.abs(o)>4)&&(document.removeEventListener("mousemove",Ve),document.removeEventListener("mouseup",Qe),an(ie,_e,ke),ie=null)}function Qe(){document.removeEventListener("mousemove",Ve),document.removeEventListener("mouseup",Qe),ie=null}function an(e,t,o){Le=e;const n=e.getBoundingClientRect();Ue=t-n.left,Ge=o-n.top,F=e.cloneNode(!0),F.style.cssText+=`position:fixed;pointer-events:none;z-index:9998;opacity:0.7;
        left:${n.left}px;top:${n.top}px;width:${n.width}px;height:${n.height}px;`,document.body.appendChild(F),e.style.opacity="0.3",document.addEventListener("mousemove",fo),document.addEventListener("mouseup",mo)}function fo(e){F.style.left=e.clientX-Ue+"px",F.style.top=e.clientY-Ge+"px"}function mo(e){document.removeEventListener("mousemove",fo),document.removeEventListener("mouseup",mo),F.remove(),F=null;const t=p.getBoundingClientRect(),o=Le;let n=e.clientX-t.left+p.scrollLeft-Ue,a=e.clientY-t.top+p.scrollTop-Ge;n=Math.max(0,Math.min(n,Y-o.offsetWidth)),a=Math.max(0,Math.min(a,D-o.offsetHeight)),o.style.left=n+"px",o.style.top=a+"px",o.style.opacity="1",Le=null,xo(o,n,a)}function xo(e,t,o){const n=e.querySelector("img");fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":c},body:JSON.stringify({whiteboard_id:u,item_type:"image",item_id:parseInt(e.dataset.imageId),pos_x:t,pos_y:o,meta:{src:n.src.replace(location.origin,""),width:e.offsetWidth,height:e.offsetHeight}})})}let M=null,bo=0,go=0,vo=0,Eo=0;function pt(e,t){e.stopPropagation(),e.preventDefault(),M=t,bo=e.touches?e.touches[0].clientX:e.clientX,go=e.touches?e.touches[0].clientY:e.clientY,vo=t.offsetWidth,Eo=t.offsetHeight,document.addEventListener("mousemove",wo),document.addEventListener("mouseup",So)}function wo(e){M&&(M.style.width=Math.max(40,vo+(e.clientX-bo))+"px",M.style.height=Math.max(40,Eo+(e.clientY-go))+"px")}function So(){document.removeEventListener("mousemove",wo),document.removeEventListener("mouseup",So),M&&(xo(M,parseFloat(M.style.left)||0,parseFloat(M.style.top)||0),M=null)}function sn(){const e=document.createElement("input");e.type="file",e.accept="image/*",e.addEventListener("change",()=>{const t=e.files[0];if(!t)return;const o=new FormData;o.append("whiteboard_id",u),o.append("image",t),fetch("/board/image",{method:"POST",headers:{"X-CSRF-TOKEN":c},body:o}).then(n=>n.json()).then(n=>{const a=Je(n.item);document.getElementById("board-canvas").appendChild(a),ue(a)})}),e.click()}function rn(e){const o=e.querySelector("img").src.replace(location.origin,"");fetch("/board/image/copy",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":c},body:JSON.stringify({whiteboard_id:u,src:o,width:e.offsetWidth,height:e.offsetHeight})}).then(n=>n.json()).then(n=>{const a=n.item;H!==e&&(k(0),Z(e)),k(f+20),a.pos_x=(parseFloat(e.style.left)||0)+f,a.pos_y=(parseFloat(e.style.top)||0)+f;const i=Je(a);i.querySelectorAll(".image-delete-btn, .image-copy-btn").forEach(s=>s.style.display="none"),i.querySelectorAll(".image-resize-handle").forEach(s=>s.style.display="none"),document.getElementById("board-canvas").appendChild(i),ue(i),fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":c},body:JSON.stringify({whiteboard_id:u,item_type:"image",item_id:parseInt(a.whiteboard_item_id),pos_x:a.pos_x,pos_y:a.pos_y,meta:a.meta})})})}function dn(e){setTimeout(()=>{if(document.querySelector(`.image-box[data-image-id="${e.whiteboard_item_id}"]`))return;const t=Je(e);document.getElementById("board-canvas").appendChild(t),ue(t)},100)}function ln(e){const t=document.querySelector(`.image-box[data-image-id="${e.itemId}"]`);t&&t.remove()}function cn(e){var o,n;const t=document.querySelector(`.image-box[data-image-id="${e.itemId}"]`);t&&(t.style.left=e.posX+"px",t.style.top=e.posY+"px",(o=e.meta)!=null&&o.width&&(t.style.width=e.meta.width+"px"),(n=e.meta)!=null&&n.height&&(t.style.height=e.meta.height+"px"))}window.addStaff=Io;window.addZone=Fo;window.addText=Ho;window.addShape=en;window.clearBoard=pn;window.addImage=sn;document.querySelectorAll(".magnet").forEach(e=>re(e));document.querySelectorAll(".magnet-zone").forEach(e=>de(e));document.querySelectorAll(".text-box").forEach(e=>le(e));document.querySelectorAll(".shape-box").forEach(e=>ce(e));document.querySelectorAll(".image-box").forEach(e=>ue(e));let ae=!1,zo=0,Lo=0,_o=0,ko=0;p.addEventListener("mousedown",e=>{if(e.target===p||e.target.id==="board-canvas"||e.target.closest("#board-canvas")===document.getElementById("board-canvas")&&!e.target.closest(".magnet")&&!e.target.closest(".magnet-zone")&&!e.target.closest(".text-box")&&!e.target.closest(".shape-box")&&!e.target.closest(".image-box")){const t=document.querySelector('.text-box-inner[contenteditable="true"]');if(t){t.blur();return}ae=!0,zo=e.clientX,Lo=e.clientY,_o=p.scrollLeft,ko=p.scrollTop,p.style.cursor="grabbing",e.preventDefault()}});document.addEventListener("mousemove",e=>{ae&&(p.scrollLeft=_o-(e.clientX-zo),p.scrollTop=ko-(e.clientY-Lo))});document.addEventListener("mouseup",()=>{ae&&(ae=!1,p.style.cursor="default")});document.getElementById("board-canvas").addEventListener("mousedown",e=>{if(e.target.closest(".text-box"))return;const t=document.querySelector('.text-box-inner[contenteditable="true"]');t&&t.blur()});window.Echo.channel("whiteboard."+u).listen(".board.updated",e=>{switch(e.action){case"item.updated":e.payload.itemType==="staff"&&Bo(e.payload),e.payload.itemType==="zone"&&Yo(e.payload),e.payload.itemType==="text"&&Jo(e.payload),e.payload.itemType==="shape"&&nn(e.payload),e.payload.itemType==="image"&&cn(e.payload);break;case"staff.added":Mo(e.payload);break;case"staff.deleted":Oo(e.payload);break;case"zone.added":No(e.payload);break;case"zone.deleted":jo(e.payload);break;case"text.added":Wo(e.payload);break;case"text.deleted":Zo(e.payload);break;case"shape.added":tn(e.payload);break;case"shape.deleted":on(e.payload);break;case"image.added":dn(e.payload);break;case"image.deleted":ln(e.payload);break}});const U=24,ut=120,G=document.getElementById("ruler-top-inner"),V=document.getElementById("ruler-left-inner");if(G&&V){for(let e=0;e<=Y;e+=U){const t=e%ut===0,o=document.createElement("div");if(o.style.cssText=`position:absolute;left:${e}px;bottom:0;width:1px;
            height:${t?6:3}px;background:${t?"#9ca3af":"#c8c6be"};`,G.appendChild(o),t){const n=document.createElement("div");n.style.cssText=`position:absolute;left:${e+2}px;top:3px;
                font-size:9px;color:#9ca3af;`,n.textContent=e/U,G.appendChild(n)}}for(let e=0;e<=D;e+=U){const t=e%ut===0,o=document.createElement("div");if(o.style.cssText=`position:absolute;top:${e}px;right:0;height:1px;
            width:${t?6:3}px;background:${t?"#9ca3af":"#c8c6be"};`,V.appendChild(o),t){const n=document.createElement("div");n.style.cssText=`position:absolute;top:${e+2}px;left:1px;
                font-size:9px;color:#9ca3af;`,n.textContent=e/U,V.appendChild(n)}}p.addEventListener("scroll",()=>{G.style.transform=`translateX(-${p.scrollLeft}px)`,V.style.transform=`translateY(-${p.scrollTop}px)`})}function pn(){confirm(`ボード上の全ての要素を削除しますか？
この操作は元に戻せません。`)&&fetch("/board/clear",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":c},body:JSON.stringify({whiteboard_id:u})}).then(e=>e.json()).then(()=>{document.querySelectorAll(".magnet").forEach(e=>e.remove()),document.querySelectorAll(".magnet-zone").forEach(e=>e.remove()),document.querySelectorAll(".text-box").forEach(e=>e.remove()),document.querySelectorAll(".shape-box").forEach(e=>e.remove()),document.querySelectorAll(".image-box").forEach(e=>e.remove())})}window.addEventListener("load",()=>{setTimeout(()=>{document.getElementById("wb-toolbar").style.display="flex"},505)});
