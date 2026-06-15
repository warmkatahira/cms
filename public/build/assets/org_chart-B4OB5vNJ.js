const c=document.getElementById("board"),L=document.getElementById("tray"),v=parseInt(c.dataset.whiteboardId),G=parseInt(c.dataset.canvasW),U=parseInt(c.dataset.canvasH),f=document.querySelector('meta[name="csrf-token"]').content,C=[{bg:"#E6F1FB",border:"#378ADD",text:"#0C447C"},{bg:"#EAF3DE",border:"#639922",text:"#27500A"},{bg:"#FAEEDA",border:"#BA7517",text:"#633806"},{bg:"#FBEAF0",border:"#D4537E",text:"#72243E"},{bg:"#E1F5EE",border:"#1D9E75",text:"#085041"},{bg:"#EEEDFE",border:"#7F77DD",text:"#3C3489"},{bg:"#FAECE7",border:"#D85A30",text:"#711B13"}];let l=null,m=null,$=0,A=0,_=null,q=0,B=0;document.querySelectorAll(".magnet").forEach(e=>ce(e));let z=null,y=null,D=0,M=0,I=null,R=0,X=0;function H(e,o){if(e.target.classList.contains("chip-edit-btn"))return;z&&(z.style.opacity="1",z=null),y&&(y.remove(),y=null);const n=e.touches?e.touches[0].clientX:e.clientX,t=e.touches?e.touches[0].clientY:e.clientY;I=o,R=n,X=t,document.addEventListener("mousemove",Y),document.addEventListener("mouseup",F)}function Y(e){const o=e.clientX-R,n=e.clientY-X;(Math.abs(o)>4||Math.abs(n)>4)&&(document.removeEventListener("mousemove",Y),document.removeEventListener("mouseup",F),$e(I,R,X),I=null)}function F(){document.removeEventListener("mousemove",Y),document.removeEventListener("mouseup",F),I=null}function $e(e,o,n){z=e;const t=e.getBoundingClientRect();D=o-t.left,M=n-t.top,y=e.cloneNode(!0),y.style.cssText=`
        position:fixed;pointer-events:none;z-index:9998;opacity:0.7;
        left:${t.left}px;top:${t.top}px;
        width:${t.width}px;height:${t.height}px;
    `,document.body.appendChild(y),e.style.opacity="0.3",document.addEventListener("mousemove",V),document.addEventListener("mouseup",te),document.addEventListener("touchmove",Q,{passive:!1}),document.addEventListener("touchend",oe)}function V(e){ee(e.clientX,e.clientY)}function Q(e){e.preventDefault(),ee(e.touches[0].clientX,e.touches[0].clientY)}function ee(e,o){y.style.left=e-D+"px",y.style.top=o-M+"px"}function te(e){ne(e.clientX,e.clientY)}function oe(e){ne(e.changedTouches[0].clientX,e.changedTouches[0].clientY)}function ne(e,o){document.removeEventListener("mousemove",V),document.removeEventListener("mouseup",te),document.removeEventListener("touchmove",Q),document.removeEventListener("touchend",oe),y.remove(),y=null;const n=c.getBoundingClientRect(),t=z,i=t.dataset.zoneId;let d=e-n.left+c.scrollLeft-D,s=o-n.top+c.scrollTop-M;const r=t.offsetWidth,E=t.offsetHeight;d=Math.max(0,Math.min(d,G-r)),s=Math.max(0,Math.min(s,U-E)),t.style.left=d+"px",t.style.top=s+"px",t.style.opacity="1",z=null,fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":f},body:JSON.stringify({whiteboard_id:v,item_type:"zone",item_id:parseInt(i),on_board:!0,pos_x:d,pos_y:s,meta:{color_index:parseInt(t.dataset.colorIndex??0),label:t.dataset.label??"",width:t.offsetWidth,height:t.offsetHeight}})})}function P(e,o){l&&(l.style.opacity="1",l=null),m&&(m.remove(),m=null);const n=e.touches?e.touches[0].clientX:e.clientX,t=e.touches?e.touches[0].clientY:e.clientY;_=o,q=n,B=t,document.addEventListener("mousemove",Z),document.addEventListener("mouseup",N)}function Z(e){const o=e.clientX-q,n=e.clientY-B;(Math.abs(o)>4||Math.abs(n)>4)&&(document.removeEventListener("mousemove",Z),document.removeEventListener("mouseup",N),Ae(_,q,B),_=null)}function N(){document.removeEventListener("mousemove",Z),document.removeEventListener("mouseup",N),_=null}function Ae(e,o,n){l=e;const t=e.getBoundingClientRect();$=o-t.left,A=n-t.top,m=e.cloneNode(!0),m.style.cssText=`
        position:fixed;pointer-events:none;z-index:9999;opacity:0.85;
        left:${t.left}px;top:${t.top}px;
        transform:rotate(2deg) scale(1.05);
    `,document.body.appendChild(m),e.style.opacity="0.3",document.addEventListener("mousemove",ie),document.addEventListener("mouseup",ae),document.addEventListener("touchmove",de,{passive:!1}),document.addEventListener("touchend",re)}function ie(e){se(e.clientX,e.clientY)}function de(e){e.preventDefault(),se(e.touches[0].clientX,e.touches[0].clientY)}function se(e,o){m.style.left=e-$+"px",m.style.top=o-A+"px"}function ae(e){le(e.clientX,e.clientY)}function re(e){le(e.changedTouches[0].clientX,e.changedTouches[0].clientY)}function le(e,o){document.removeEventListener("mousemove",ie),document.removeEventListener("mouseup",ae),document.removeEventListener("touchmove",de),document.removeEventListener("touchend",re),m.remove(),m=null;const n=c.getBoundingClientRect(),t=L.getBoundingClientRect(),i=l.dataset.id,d=e>=n.left&&e<=n.right&&o>=n.top&&o<=n.bottom,s=e>=t.left&&e<=t.right&&o>=t.top&&o<=t.bottom;if(d){let r=e-n.left+c.scrollLeft-$,E=o-n.top+c.scrollTop-A;r=Math.max(0,Math.min(r,G-80)),E=Math.max(0,Math.min(E,U-50)),W(i,!0,r,E),l.style.position="absolute",l.style.left=r+"px",l.style.top=E+"px",document.getElementById("board-canvas").appendChild(l)}else if(s){W(i,!1,0,0),l.style.position="",l.style.left="",l.style.top="";const r=l.querySelector(".staff-chip-wrap > div");r&&(r.style.width="90px",r.style.height="",r.style.borderRadius="8px",r.style.clipPath=""),l.dataset.shape="rect",L.appendChild(l)}l.style.opacity="1",l=null}function W(e,o,n,t){const i=document.querySelector(`.magnet[data-id="${e}"]`),d=i?i.querySelector(".staff-chip-wrap > div"):null,s=d?{width:d.offsetWidth,height:d.offsetHeight}:null;fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":f},body:JSON.stringify({whiteboard_id:v,item_id:parseInt(e),on_board:o,pos_x:n,pos_y:t,meta:s})})}window.addStaff=function(){const e=document.getElementById("newName").value.trim(),o=document.getElementById("newRole").value.trim();e&&fetch("/board/staff",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":f},body:JSON.stringify({whiteboard_id:v,staff_name:e,role_name:o})}).then(n=>n.json()).then(n=>{const t=n.staff,i=C[(t.color??0)%C.length],d="90px",s=document.createElement("div");s.className="magnet cursor-grab select-none",s.dataset.id=t.staff_id,s.dataset.color=t.color,s.dataset.name=t.staff_name,s.dataset.role=t.role_name??"",s.dataset.size=t.size??"M",s.dataset.shape=t.shape??"rect",s.innerHTML=`
            <div class="staff-chip-wrap" style="position:relative;display:inline-block;">
                <div style="
                    width:${d};padding:6px;border-radius:8px;text-align:center;
                    border:2px solid ${i.border};background:${i.bg};
                ">
                    <div data-field="name" style="font-size:12px;font-weight:500;color:${i.text};">${t.staff_name}</div>
                    <div data-field="role" style="font-size:10px;color:${i.text};opacity:.7;">${t.role_name??""}</div>
                </div>
                <div class="chip-edit-btn" style="
                    display:none;position:absolute;top:-7px;right:-7px;
                    width:18px;height:18px;border-radius:50%;
                    background:#374151;color:white;font-size:10px;
                    align-items:center;justify-content:center;
                    cursor:pointer;z-index:10;
                ">✏</div>
                <div class="chip-resize-handle" style="
                    display:none;position:absolute;bottom:-4px;right:-4px;
                    width:10px;height:10px;border-radius:2px;
                    background:#374151;cursor:se-resize;z-index:10;
                "></div>
            </div>`,ce(s),L.appendChild(s),document.getElementById("newName").value="",document.getElementById("newRole").value=""})};const a=document.createElement("div");a.id="staff-edit-modal";a.style.cssText=`
    display:none;position:fixed;inset:0;z-index:99999;
    background:rgba(0,0,0,0.4);
    align-items:center;justify-content:center;
`;a.innerHTML=`
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
                    ${C.map((e,o)=>`
                        <div class="edit-color-chip" data-color="${o}"
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
`;document.body.appendChild(a);let w=0,O="M",g="rect";a.querySelectorAll(".modal-tab").forEach(e=>{e.addEventListener("click",()=>{a.querySelectorAll(".modal-tab").forEach(o=>{o.style.borderBottomColor="transparent",o.style.color="#9ca3af"}),e.style.borderBottomColor="#374151",e.style.color="#374151",document.getElementById("tab-basic").style.display=e.dataset.tab==="basic"?"block":"none",document.getElementById("tab-appearance").style.display=e.dataset.tab==="appearance"?"block":"none"})});a.querySelectorAll(".edit-color-chip").forEach(e=>{e.addEventListener("click",()=>{w=parseInt(e.dataset.color),a.querySelectorAll(".edit-color-chip").forEach(o=>{o.style.transform="scale(1)",o.style.outline="none"}),e.style.transform="scale(1.2)",e.style.outline="2px solid #374151",e.style.outlineOffset="2px"})});a.querySelectorAll(".edit-shape-chip").forEach(e=>{e.addEventListener("click",()=>{g=e.dataset.shape,a.querySelectorAll(".edit-shape-chip").forEach(o=>{o.style.borderColor="#d1d5db",o.style.background="white"}),e.style.borderColor="#374151",e.style.background="#f3f4f6"})});document.getElementById("edit-cancel").addEventListener("click",()=>{a.style.display="none"});let j=null,x=null;function ce(e){e.addEventListener("mousedown",t=>P(t,e)),e.addEventListener("touchstart",t=>P(t,e),{passive:!1}),e.addEventListener("mouseenter",()=>{const t=e.querySelector(".chip-edit-btn");t&&(t.style.display="flex");const i=e.querySelector(".chip-resize-handle");i&&(i.style.display="block")}),e.addEventListener("mouseleave",()=>{const t=e.querySelector(".chip-edit-btn");t&&(t.style.display="none");const i=e.querySelector(".chip-resize-handle");i&&(i.style.display="none")});const o=e.querySelector(".chip-edit-btn");o&&(o.addEventListener("mousedown",t=>t.stopPropagation()),o.addEventListener("click",t=>{t.stopPropagation(),De(t,e)}));const n=e.querySelector(".chip-resize-handle");n&&(n.addEventListener("mousedown",t=>J(t,e)),n.addEventListener("touchstart",t=>J(t,e),{passive:!1}))}function De(e,o){e.preventDefault(),j=o.dataset.id,x=o;const n=L.contains(o),t=a.querySelector('.modal-tab[data-tab="appearance"]');t&&(t.style.display=n?"none":"block"),document.getElementById("edit-name").value=o.dataset.name??"",document.getElementById("edit-role").value=o.dataset.role??"",w=parseInt(o.dataset.color??0)||0,O=o.dataset.size??"M",g=o.dataset.shape??"rect",a.querySelectorAll(".edit-color-chip").forEach(d=>{d.style.transform="scale(1)",d.style.outline="none"});const i=a.querySelector(`.edit-color-chip[data-color="${w}"]`);i&&(i.style.transform="scale(1.2)",i.style.outline="2px solid #374151",i.style.outlineOffset="2px"),a.querySelectorAll(".edit-size-chip").forEach(d=>{const s=d.dataset.size===O;d.style.background=s?"#374151":"white",d.style.borderColor=s?"#374151":"#d1d5db",d.style.color=s?"white":"#374151"}),g=o.dataset.shape??"rect",a.querySelectorAll(".edit-shape-chip").forEach(d=>{const s=d.dataset.shape===g;d.style.borderColor=s?"#374151":"#d1d5db",d.style.background=s?"#f3f4f6":"white"}),document.getElementById("tab-basic").style.display="block",document.getElementById("tab-appearance").style.display="none",a.querySelectorAll(".modal-tab").forEach(d=>{const s=d.dataset.tab==="basic";d.style.borderBottomColor=s?"#374151":"transparent",d.style.color=s?"#374151":"#9ca3af"}),a.style.display="flex"}document.getElementById("edit-save").addEventListener("click",()=>{const e=document.getElementById("edit-name").value.trim(),o=document.getElementById("edit-role").value.trim();e&&fetch("/board/staff/"+j,{method:"PATCH",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":f},body:JSON.stringify({staff_name:e,role_name:o,color:w,shape:g})}).then(n=>n.json()).then(()=>{const n=C[w],t=x.querySelector(".staff-chip-wrap"),i=t.querySelector("div");i.style.background=n.bg,i.style.borderColor=n.border;const d={rect:"border-radius:8px;clip-path:none;",circle:"border-radius:50%;clip-path:none;",sharp:"border-radius:0;clip-path:none;",rounded_bottom:"border-radius:0 0 50% 50%;clip-path:none;",tab:"border-radius:0 0 8px 8px;clip-path:none;"};i.style.cssText=`
            background:${n.bg};
            border:2px solid ${n.border};
            border-top:${g==="tab"?"4px":"2px"} solid ${n.border};
            width:${i.style.width||"90px"};
            padding:6px;
            text-align:center;
            ${d[g]??d.rect}
        `,x.dataset.shape=g,x.dataset.size=O,x.dataset.color=w,x.dataset.name=e,x.dataset.role=o;const s=t.querySelector('[data-field="name"]'),r=t.querySelector('[data-field="role"]');s&&(s.textContent=e,s.style.color=n.text),r&&(r.textContent=o,r.style.color=n.text),a.style.display="none"})});document.getElementById("edit-delete").addEventListener("click",()=>{confirm("このスタッフを削除しますか？")&&fetch("/board/staff/"+j,{method:"DELETE",headers:{"X-CSRF-TOKEN":f}}).then(e=>e.json()).then(()=>{x.remove(),a.style.display="none"})});let k=!1,pe=0,ue=0,he=0,me=0;c.addEventListener("mousedown",e=>{(e.target===c||e.target.id==="board-canvas"||e.target.closest("#board-canvas")===document.getElementById("board-canvas")&&!e.target.closest(".magnet")&&!e.target.closest(".magnet-zone"))&&(k=!0,pe=e.clientX,ue=e.clientY,he=c.scrollLeft,me=c.scrollTop,c.style.cursor="grabbing",e.preventDefault())});document.addEventListener("mousemove",e=>{k&&(c.scrollLeft=he-(e.clientX-pe),c.scrollTop=me-(e.clientY-ue))});document.addEventListener("mouseup",()=>{k&&(k=!1,c.style.cursor="default")});const T=[{border:"#378ADD",bg:"rgba(56,138,221,0.06)",text:"#0C447C"},{border:"#639922",bg:"rgba(99,153,34,0.06)",text:"#27500A"},{border:"#D4537E",bg:"rgba(212,83,126,0.06)",text:"#72243E"},{border:"#BA7517",bg:"rgba(186,117,23,0.06)",text:"#633806"},{border:"#7F77DD",bg:"rgba(127,119,221,0.06)",text:"#3C3489"}],h=document.createElement("div");h.id="zone-edit-modal";h.style.cssText=`
    display:none;position:fixed;inset:0;z-index:99999;
    background:rgba(0,0,0,0.4);
    align-items:center;justify-content:center;
`;h.innerHTML=`
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
                ${T.map((e,o)=>`
                    <div class="zone-color-chip" data-color-index="${o}"
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
`;document.body.appendChild(h);let S=0,p=null;h.querySelectorAll(".zone-color-chip").forEach(e=>{e.addEventListener("click",()=>{S=parseInt(e.dataset.colorIndex),h.querySelectorAll(".zone-color-chip").forEach(o=>{o.style.outline="none",o.style.transform="scale(1)"}),e.style.outline="2px solid #374151",e.style.outlineOffset="2px",e.style.transform="scale(1.2)"})});document.getElementById("zone-edit-cancel").addEventListener("click",()=>{h.style.display="none"});document.getElementById("zone-edit-save").addEventListener("click",()=>{const e=document.getElementById("zone-edit-label").value.trim();if(!e)return;const o=p.dataset.zoneId,n=T[S];fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":f},body:JSON.stringify({whiteboard_id:v,item_type:"zone",item_id:parseInt(o),on_board:!0,pos_x:parseFloat(p.style.left)||0,pos_y:parseFloat(p.style.top)||0,meta:{color_index:S,label:e,width:parseFloat(p.style.width)||p.offsetWidth,height:parseFloat(p.style.height)||p.offsetHeight}})}),p.style.borderColor=n.border,p.style.background=n.bg,p.dataset.colorIndex=S,p.dataset.label=e;const t=p.querySelector(".zone-label-text");t&&(t.textContent=e,t.style.color=n.text),h.style.display="none"});function ye(e){e.addEventListener("mousedown",t=>H(t,e)),e.addEventListener("touchstart",t=>H(t,e),{passive:!1}),e.addEventListener("mouseenter",()=>{const t=e.querySelector(".zone-edit-btn");t&&(t.style.display="flex");const i=e.querySelector(".zone-resize-handle");i&&(i.style.display="block")}),e.addEventListener("mouseleave",()=>{const t=e.querySelector(".zone-edit-btn");t&&(t.style.display="none");const i=e.querySelector(".zone-resize-handle");i&&(i.style.display="none")});const o=e.querySelector(".zone-edit-btn");o&&(o.addEventListener("mousedown",t=>t.stopPropagation()),o.addEventListener("click",t=>{t.stopPropagation(),p=e,S=parseInt(e.dataset.colorIndex??0),document.getElementById("zone-edit-label").value=e.dataset.label??"",h.querySelectorAll(".zone-color-chip").forEach(i=>{const d=parseInt(i.dataset.colorIndex)===S;i.style.outline=d?"2px solid #374151":"none",i.style.outlineOffset="2px",i.style.transform=d?"scale(1.2)":"scale(1)"}),h.style.display="flex"}));const n=e.querySelector(".zone-resize-handle");n&&(n.addEventListener("mousedown",t=>K(t,e)),n.addEventListener("touchstart",t=>K(t,e),{passive:!1}))}document.querySelectorAll(".magnet-zone").forEach(e=>ye(e));let u=null,fe=0,be=0,xe=0,ge=0;function K(e,o){e.stopPropagation(),e.preventDefault(),u=o,fe=e.touches?e.touches[0].clientX:e.clientX,be=e.touches?e.touches[0].clientY:e.clientY,xe=o.offsetWidth,ge=o.offsetHeight,document.addEventListener("mousemove",ve),document.addEventListener("mouseup",we),document.addEventListener("touchmove",Ee,{passive:!1}),document.addEventListener("touchend",Se)}function ve(e){ze(e.clientX,e.clientY)}function Ee(e){e.preventDefault(),ze(e.touches[0].clientX,e.touches[0].clientY)}function ze(e,o){if(!u)return;const n=e-fe,t=o-be,i=Math.max(100,xe+n),d=Math.max(80,ge+t);u.style.width=i+"px",u.style.height=d+"px"}function we(e){Le(e.clientX,e.clientY)}function Se(e){Le(e.changedTouches[0].clientX,e.changedTouches[0].clientY)}function Le(e,o){if(document.removeEventListener("mousemove",ve),document.removeEventListener("mouseup",we),document.removeEventListener("touchmove",Ee),document.removeEventListener("touchend",Se),!u)return;const n=u.dataset.zoneId,t=u.offsetWidth,i=u.offsetHeight,d=parseFloat(u.style.left)||0,s=parseFloat(u.style.top)||0,r={color_index:parseInt(u.dataset.colorIndex??0),label:u.dataset.label??"",width:t,height:i};fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":f},body:JSON.stringify({whiteboard_id:v,item_type:"zone",item_id:parseInt(n),on_board:!0,pos_x:d,pos_y:s,meta:r})}),u=null}let b=null,Ce=0,_e=0,Ie=0,ke=0;function J(e,o){e.stopPropagation(),e.preventDefault(),b=o,Ce=e.touches?e.touches[0].clientX:e.clientX,_e=e.touches?e.touches[0].clientY:e.clientY;const n=o.querySelector(".staff-chip-wrap > div");Ie=n?n.offsetWidth:90,ke=n?n.offsetHeight:40,document.addEventListener("mousemove",Te),document.addEventListener("mouseup",Re),document.addEventListener("touchmove",qe,{passive:!1}),document.addEventListener("touchend",Xe)}function Te(e){Be(e.clientX,e.clientY)}function qe(e){e.preventDefault(),Be(e.touches[0].clientX,e.touches[0].clientY)}function Be(e,o){if(!b)return;const n=e-Ce,t=o-_e,i=Math.max(50,Ie+n),d=Math.max(50,ke+t),s=b.querySelector(".staff-chip-wrap > div");s&&(s.style.width=i+"px",s.style.height=d+"px")}function Re(e){Oe()}function Xe(e){Oe()}function Oe(){if(document.removeEventListener("mousemove",Te),document.removeEventListener("mouseup",Re),document.removeEventListener("touchmove",qe),document.removeEventListener("touchend",Xe),!b)return;const e=b.querySelector(".staff-chip-wrap > div"),o=b.dataset.id,n=e?e.offsetWidth:90,t=e?e.offsetHeight:40;fetch("/board/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":f},body:JSON.stringify({whiteboard_id:v,item_id:parseInt(o),on_board:!0,pos_x:parseFloat(b.style.left)||0,pos_y:parseFloat(b.style.top)||0,meta:{width:n,height:t}})}),b=null}window.addZone=function(){const e=document.getElementById("newZoneLabel").value.trim();e&&fetch("/board/zone",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":f},body:JSON.stringify({whiteboard_id:v,label:e,color_index:0})}).then(o=>o.json()).then(o=>{const n=o.item,t=n.meta,i=T[t.color_index??0],d=document.createElement("div");d.className="zone magnet-zone cursor-grab select-none absolute border-2 rounded-xl",d.dataset.zoneId=n.whiteboard_item_id,d.dataset.colorIndex=t.color_index??0,d.dataset.label=t.label,d.style.cssText=`
            left:40px;top:40px;
            width:180px;height:280px;
            border-color:${i.border};
            background:${i.bg};
        `,d.innerHTML=`
            <span class="zone-label-text absolute -top-3 left-2 text-xs font-medium px-1 rounded pointer-events-none select-none"
                  style="color:${i.text};background:#f7f6f0;">
                ${t.label}
            </span>
            <div class="zone-edit-btn" style="
                display:none;position:absolute;top:-7px;right:-7px;
                width:18px;height:18px;border-radius:50%;
                background:#374151;color:white;font-size:10px;
                align-items:center;justify-content:center;
                cursor:pointer;z-index:10;
            ">✏</div>
            <div class="zone-resize-handle" style="
                display:none;position:absolute;bottom:-4px;right:-4px;
                width:14px;height:14px;border-radius:2px;
                color:#374151;font-size:18px;line-height:14px;text-align:center;
                cursor:se-resize;z-index:10;user-select:none;
            ">⤡</div>
        `,document.getElementById("board-canvas").appendChild(d),ye(d),document.getElementById("newZoneLabel").value=""})};document.getElementById("zone-edit-delete").addEventListener("click",()=>{if(!confirm("このグループを削除しますか？"))return;const e=p.dataset.zoneId;fetch("/board/zone/"+e,{method:"DELETE",headers:{"X-CSRF-TOKEN":f}}).then(o=>o.json()).then(()=>{p.remove(),h.style.display="none"})});window.Echo.channel("whiteboard."+v).listen(".item.updated",e=>{e.item_type==="staff"?Me(e):e.item_type==="zone"&&Ye(e)});function Me(e){var n,t;const o=document.querySelector(`.magnet[data-id="${e.item_id}"]`);o&&(e.on_board?(o.style.position="absolute",o.style.left=e.pos_x+"px",o.style.top=e.pos_y+"px",(n=e.meta)!=null&&n.width&&(o.querySelector(".staff-chip-wrap > div").style.width=e.meta.width+"px"),(t=e.meta)!=null&&t.height&&(o.querySelector(".staff-chip-wrap > div").style.height=e.meta.height+"px"),document.getElementById("board-canvas").appendChild(o)):(o.style.position="",o.style.left="",o.style.top="",L.appendChild(o)))}function Ye(e){var n,t,i,d;const o=document.querySelector(`.magnet-zone[data-zone-id="${e.item_id}"]`);if(o){if(o.style.left=e.pos_x+"px",o.style.top=e.pos_y+"px",(n=e.meta)!=null&&n.width&&(o.style.width=e.meta.width+"px"),(t=e.meta)!=null&&t.height&&(o.style.height=e.meta.height+"px"),((i=e.meta)==null?void 0:i.color_index)!==void 0){const s=T[e.meta.color_index];o.style.borderColor=s.border,o.style.background=s.bg}if((d=e.meta)!=null&&d.label){const s=o.querySelector(".zone-label-text");s&&(s.textContent=e.meta.label)}}}
