const m=document.getElementById("board"),E=document.getElementById("tray"),M=parseInt(m.dataset.whiteboardId),F=parseInt(m.dataset.canvasW),O=parseInt(m.dataset.canvasH),R=document.getElementById("baseSel").value,v=document.querySelector('meta[name="csrf-token"]').content,h=[{bg:"#E6F1FB",border:"#378ADD",text:"#0C447C"},{bg:"#EAF3DE",border:"#639922",text:"#27500A"},{bg:"#FAEEDA",border:"#BA7517",text:"#633806"},{bg:"#FBEAF0",border:"#D4537E",text:"#72243E"},{bg:"#E1F5EE",border:"#1D9E75",text:"#085041"},{bg:"#EEEDFE",border:"#7F77DD",text:"#3C3489"},{bg:"#FAECE7",border:"#D85A30",text:"#711B13"}],w={XS:"50px",S:"70px",M:"90px",L:"110px",XL:"130px"};let a=null,s=null,f=0,x=0,g=null,S=0,k=0;document.querySelectorAll(".magnet").forEach(e=>j(e));function B(e,o){a&&(a.style.opacity="1",a=null),s&&(s.remove(),s=null);const t=e.touches?e.touches[0].clientX:e.clientX,d=e.touches?e.touches[0].clientY:e.clientY;g=o,S=t,k=d,document.addEventListener("mousemove",C),document.addEventListener("mouseup",L)}function C(e){const o=e.clientX-S,t=e.clientY-k;(Math.abs(o)>4||Math.abs(t)>4)&&(document.removeEventListener("mousemove",C),document.removeEventListener("mouseup",L),N(g,S,k),g=null)}function L(){document.removeEventListener("mousemove",C),document.removeEventListener("mouseup",L),g=null}function N(e,o,t){a=e;const d=e.getBoundingClientRect();f=o-d.left,x=t-d.top,s=e.cloneNode(!0),s.style.cssText=`
        position:fixed;pointer-events:none;z-index:9999;opacity:0.85;
        left:${d.left}px;top:${d.top}px;
        transform:rotate(2deg) scale(1.05);
    `,document.body.appendChild(s),e.style.opacity="0.3",document.addEventListener("mousemove",A),document.addEventListener("mouseup",q),document.addEventListener("touchmove",_,{passive:!1}),document.addEventListener("touchend",T)}function A(e){$(e.clientX,e.clientY)}function _(e){e.preventDefault(),$(e.touches[0].clientX,e.touches[0].clientY)}function $(e,o){s.style.left=e-f+"px",s.style.top=o-x+"px"}function q(e){D(e.clientX,e.clientY)}function T(e){D(e.changedTouches[0].clientX,e.changedTouches[0].clientY)}function D(e,o){document.removeEventListener("mousemove",A),document.removeEventListener("mouseup",q),document.removeEventListener("touchmove",_),document.removeEventListener("touchend",T),s.remove(),s=null;const t=m.getBoundingClientRect(),d=E.getBoundingClientRect(),n=a.dataset.id,u=e>=t.left&&e<=t.right&&o>=t.top&&o<=t.bottom,r=e>=d.left&&e<=d.right&&o>=d.top&&o<=d.bottom;if(u){const y=(e-f-t.left)/t.width*F,X=(o-x-t.top)/t.height*O;I(n,!0,y,X),a.style.position="absolute",a.style.left=(e-f-t.left)/t.width*100+"%",a.style.top=(o-x-t.top)/t.height*100+"%",m.appendChild(a)}else r&&(I(n,!1,0,0),a.style.position="",a.style.left="",a.style.top="",E.appendChild(a));a.style.opacity="1",a=null}function I(e,o,t,d){fetch("/org_chart/item",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":v},body:JSON.stringify({whiteboard_id:M,item_id:parseInt(e),on_board:o,pos_x:t,pos_y:d})})}window.addStaff=function(){const e=document.getElementById("newName").value.trim(),o=document.getElementById("newRole").value.trim();e&&fetch("/org_chart/staff",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":v},body:JSON.stringify({base_id:R,staff_name:e,role_name:o})}).then(t=>t.json()).then(t=>{const d=t.staff,n=h[(d.color??0)%h.length],u=w[d.size??"M"],r=document.createElement("div");r.className="magnet cursor-grab select-none",r.dataset.id=d.staff_id,r.dataset.color=d.color,r.dataset.name=d.staff_name,r.dataset.role=d.role_name??"",r.dataset.size=d.size??"M",r.dataset.shape=d.shape??"rect",r.innerHTML=`
                <div class="staff-chip-wrap" style="position:relative;display:inline-block;">
                    <div style="
                        width:${u};padding:6px;border-radius:8px;text-align:center;
                        border:2px solid ${n.border};background:${n.bg};
                    ">
                        <div data-field="name" style="font-size:12px;font-weight:500;color:${n.text};">${d.staff_name}</div>
                        <div data-field="role" style="font-size:10px;color:${n.text};opacity:.7;">${d.role_name??""}</div>
                    </div>
                    <div class="chip-edit-btn" style="
                        display:none;position:absolute;top:-7px;right:-7px;
                        width:18px;height:18px;border-radius:50%;
                        background:#374151;color:white;font-size:10px;
                        align-items:center;justify-content:center;
                        cursor:pointer;z-index:10;
                    ">✏</div>
                </div>`,j(r),E.appendChild(r),document.getElementById("newName").value="",document.getElementById("newRole").value=""})};const i=document.createElement("div");i.id="staff-edit-modal";i.style.cssText=`
    display:none;position:fixed;inset:0;z-index:99999;
    background:rgba(0,0,0,0.4);
    align-items:center;justify-content:center;
`;i.innerHTML=`
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
                    ${h.map((e,o)=>`
                        <div class="edit-color-chip" data-color="${o}"
                             style="width:24px;height:24px;border-radius:50%;cursor:pointer;
                                    background:${e.bg};border:2px solid ${e.border};">
                        </div>
                    `).join("")}
                </div>
            </div>
            <div style="margin-bottom:16px;">
                <label style="font-size:12px;color:#6b7280;display:block;margin-bottom:8px;">サイズ</label>
                <div style="display:flex;gap:8px;">
                    ${["XS","S","M","L","XL"].map(e=>`
                        <div class="edit-size-chip" data-size="${e}"
                             style="width:40px;height:32px;border-radius:6px;cursor:pointer;
                                    display:flex;align-items:center;justify-content:center;
                                    font-size:13px;font-weight:500;
                                    border:1.5px solid #d1d5db;color:#374151;background:white;">
                            ${e}
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
`;document.body.appendChild(i);let b=0,p="M",c="rect";i.querySelectorAll(".modal-tab").forEach(e=>{e.addEventListener("click",()=>{i.querySelectorAll(".modal-tab").forEach(o=>{o.style.borderBottomColor="transparent",o.style.color="#9ca3af"}),e.style.borderBottomColor="#374151",e.style.color="#374151",document.getElementById("tab-basic").style.display=e.dataset.tab==="basic"?"block":"none",document.getElementById("tab-appearance").style.display=e.dataset.tab==="appearance"?"block":"none"})});i.querySelectorAll(".edit-color-chip").forEach(e=>{e.addEventListener("click",()=>{b=parseInt(e.dataset.color),i.querySelectorAll(".edit-color-chip").forEach(o=>{o.style.transform="scale(1)",o.style.outline="none"}),e.style.transform="scale(1.2)",e.style.outline="2px solid #374151",e.style.outlineOffset="2px"})});i.querySelectorAll(".edit-size-chip").forEach(e=>{e.addEventListener("click",()=>{p=e.dataset.size,i.querySelectorAll(".edit-size-chip").forEach(o=>{o.style.background="white",o.style.borderColor="#d1d5db",o.style.color="#374151"}),e.style.background="#374151",e.style.borderColor="#374151",e.style.color="white"})});i.querySelectorAll(".edit-shape-chip").forEach(e=>{e.addEventListener("click",()=>{c=e.dataset.shape,i.querySelectorAll(".edit-shape-chip").forEach(o=>{o.style.borderColor="#d1d5db",o.style.background="white"}),e.style.borderColor="#374151",e.style.background="#f3f4f6"})});document.getElementById("edit-cancel").addEventListener("click",()=>{i.style.display="none"});let z=null,l=null;function j(e){e.addEventListener("mousedown",t=>B(t,e)),e.addEventListener("touchstart",t=>B(t,e),{passive:!1}),e.addEventListener("mouseenter",()=>{const t=e.querySelector(".chip-edit-btn");t&&(t.style.display="flex")}),e.addEventListener("mouseleave",()=>{const t=e.querySelector(".chip-edit-btn");t&&(t.style.display="none")});const o=e.querySelector(".chip-edit-btn");o&&(o.addEventListener("mousedown",t=>t.stopPropagation()),o.addEventListener("click",t=>{t.stopPropagation(),Y(t,e)}))}function Y(e,o){e.preventDefault(),z=o.dataset.id,l=o,document.getElementById("edit-name").value=o.dataset.name??"",document.getElementById("edit-role").value=o.dataset.role??"",b=parseInt(o.dataset.color??0)||0,p=o.dataset.size??"M",c=o.dataset.shape??"rect",i.querySelectorAll(".edit-color-chip").forEach(d=>{d.style.transform="scale(1)",d.style.outline="none"});const t=i.querySelector(`.edit-color-chip[data-color="${b}"]`);t&&(t.style.transform="scale(1.2)",t.style.outline="2px solid #374151",t.style.outlineOffset="2px"),i.querySelectorAll(".edit-size-chip").forEach(d=>{const n=d.dataset.size===p;d.style.background=n?"#374151":"white",d.style.borderColor=n?"#374151":"#d1d5db",d.style.color=n?"white":"#374151"}),c=o.dataset.shape??"rect",i.querySelectorAll(".edit-shape-chip").forEach(d=>{const n=d.dataset.shape===c;d.style.borderColor=n?"#374151":"#d1d5db",d.style.background=n?"#f3f4f6":"white"}),document.getElementById("tab-basic").style.display="block",document.getElementById("tab-appearance").style.display="none",i.querySelectorAll(".modal-tab").forEach(d=>{const n=d.dataset.tab==="basic";d.style.borderBottomColor=n?"#374151":"transparent",d.style.color=n?"#374151":"#9ca3af"}),i.style.display="flex"}document.getElementById("edit-save").addEventListener("click",()=>{const e=document.getElementById("edit-name").value.trim(),o=document.getElementById("edit-role").value.trim();e&&fetch("/org_chart/staff/"+z,{method:"PATCH",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":v},body:JSON.stringify({staff_name:e,role_name:o,color:b,size:p,shape:c})}).then(t=>t.json()).then(()=>{const t=h[b],d=l.querySelector(".staff-chip-wrap"),n=d.querySelector("div");n.style.background=t.bg,n.style.borderColor=t.border,n.style.width=w[p];const u={rect:"border-radius:8px;clip-path:none;",circle:"border-radius:50%;clip-path:none;",sharp:"border-radius:0;clip-path:none;",rounded_bottom:"border-radius:0 0 50% 50%;clip-path:none;",tab:"border-radius:0 0 8px 8px;clip-path:none;"};n.style.cssText=`
            background:${t.bg};
            border:2px solid ${t.border};
            border-top:${c==="tab"?"4px":"2px"} solid ${t.border};
            width:${w[p]};
            padding:6px;
            text-align:center;
            ${u[c]??u.rect}
        `,l.dataset.shape=c,l.dataset.size=p,l.dataset.color=b,l.dataset.name=e,l.dataset.role=o;const r=d.querySelector('[data-field="name"]'),y=d.querySelector('[data-field="role"]');r&&(r.textContent=e,r.style.color=t.text),y&&(y.textContent=o,y.style.color=t.text),i.style.display="none"})});document.getElementById("edit-delete").addEventListener("click",()=>{confirm("このスタッフを削除しますか？")&&fetch("/org_chart/staff/"+z,{method:"DELETE",headers:{"X-CSRF-TOKEN":v}}).then(e=>e.json()).then(()=>{l.remove(),i.style.display="none"})});
