


const sidenave = document.querySelector('.sidenav');
const btn_nav_toggle = document.querySelector('.btn_nav_toggle');
const btn_nav_close = document.querySelector('.btn_nav_close');
if(btn_nav_toggle){
    btn_nav_toggle.addEventListener('click',()=>{
        if(sidenave.classList.contains('on')){
            sidenave.classList.remove('on');
            ScrollLock.unlock();
        }else{
            sidenave.classList.add('on');
            ScrollLock.lock();
        }
    })
}
if(btn_nav_close){
    btn_nav_close.addEventListener('click',()=>{
        sidenave.classList.remove('on');
        ScrollLock.unlock();
    })
}


function syncEndMin(startInput) {
  const set = startInput.closest('.date_set');
  const end = set && set.querySelector('input._end[type="date"]');
  if (end) {
    end.min = startInput.value || '';
    // 시작일이 종료일보다 늦으면 종료일 맞춰줌
    if (startInput.value && end.value && startInput.value > end.value) {
      end.value = startInput.value;
    }
  }
}

function syncStartMax(endInput) {
  const set = endInput.closest('.date_set');
  const start = set && set.querySelector('input._start[type="date"]');
  if (start) {
    start.max = endInput.value || '';
    // 종료일이 시작일보다 빠르면 시작일 맞춰줌
    if (start.value && endInput.value && start.value > endInput.value) {
      start.value = endInput.value;
    }
  }
}



function open_file(target){
    let $this = $(target);
    let $input_file = $this.parents('.file_box').find('.f_hidden');
    $input_file.trigger('click');
}

function select_file(target){
    let $this = $(target);
    let $val = $this.val();
    let $file_box = $this.parents('.file_box');
    let $input_txt = $file_box.find('.f_input');

    
    if($val){
        $input_txt.val($val);
        $file_box.addClass('hasFile');
        let $idx = $file_box.data('val');
        let $del_chk = $(`.del_chk${$idx}`);

        $del_chk .val($idx);
    }
}

function del_file(target){
    let $this = $(target);
    let $file_box = $this.parents('.file_box');
    let $input_file = $file_box.find('.f_hidden');
    let $input_txt = $file_box.find('.f_input');
    
    $file_box.removeClass('hasFile');
    $input_file.val(null);
    $input_txt.val(null);

    let $idx = $file_box.data('val');
    let $del_chk = $(`.del_chk${$idx}`);
    $del_chk .val($idx);
}

function del_thumbnail_file(target) 
{
    let $this = $(target);
    let $file_box = $this.parents('.file_box');
    let $input_file = $file_box.find('.f_hidden');
    let $input_txt = $file_box.find('.f_input');
    
    $file_box.removeClass('hasFile');
    $input_file.val(null);
    $input_txt.val(null);

    let $idx = $file_box.data('val');
    let $del_chk = $(`.del_chk${$idx}`);
    $('.delete_thumbnail').val("Y");
}


function add_form(max){
    let $file_set = `<div class="file_set file_num">
        <div class="file_box">
            <input type="file" name="files[]" class="f_hidden" onchange="select_file(this);return false;">
            <input type="text" class="f_input ty_mid" placeholder="파일을 선택해주세요." onclick=" open_file(this);return false;" readonly>
            <button class="btn_del" onclick=" del_file(this);return false;"><span class="blind">파일삭제</span></button>
        </div>
        <button class="btn_remove" onclick="del_form(this);return false;"><span class="blind">행 삭제</span></button>
    </div>`
    let $file_wrap = $('.file_wrap');
    let $length = $file_wrap.find('.file_set').length;
    if($length >= max){
        alert(`첨부파일은 최대 ${max}개 까지 등록 가능합니다.`)
    }else{
        $file_wrap.append($file_set);
    }
}

function del_form(target){
    let $this = $(target);
    let $file_set = $this.parents('.file_set');
    let $file_box = $file_set.find('.file_box');
    
    let $idx = $file_box.data('val');
    let $del_chk = $(`.del_chk${$idx}`);
    console.log($idx);
    $del_chk .val($idx);


    $file_set.remove();
    
}


function close_popup(target){
    let layer_popup = target.closest('.layer_popup');
    let layer_popup_cont = layer_popup.querySelector('.layer_popup_cont');
    layer_popup_cont.scrollTo({
        top:0
    }); 
    layer_popup.classList.remove('on');
}

let layer_popup_cont = document.querySelectorAll('.layer_popup_cont');
layer_popup_cont.forEach(e=>{
    e.addEventListener('click',(e)=>{
        e.stopPropagation()
    })
});





function open_popup(target){
    let layer_popup = document.querySelector(`.layer_popup.${target}`);
    layer_popup.classList.add('on');
}

function open_srch(target){
    let srch_detail = target.closest('.srch_wrap').querySelector('.srch_detail_wrap');
    srch_detail.classList.add('on');
    ScrollLock.lock();
}

function close_srch(target){
    let srch_detail = target.closest('.srch_detail_wrap');
    srch_detail.classList.remove('on');
    ScrollLock.unlock();
}


function reset(target){
   let this_form  = target.closest('form');
   this_form.reset();
}



let btn_disable = document.querySelectorAll('.f_btn.disable');
btn_disable.forEach(e=>{
    e.addEventListener('click',(e)=>{
        e.preventDefault()
    })
});



function num_down(target){
    let inputNum = $(target).siblings('.f_input');
    let currentVal = parseInt(inputNum.val());
    let newVal = currentVal - 1;
    if(newVal < 0){
        return false;
    }else {
        inputNum.val(newVal);
    }
    
    //console.log(newVal);
    
}
function num_up(target){
    let inputNum = $(target).siblings('.f_input');
    let currentVal = parseInt(inputNum.val());
    let newVal = currentVal + 1;
    inputNum.val(newVal);
    //console.log(newVal)
}



function f_alert_open() {
    document.querySelector('.f_alert_box').classList.add('on');
}

function f_alert_close() {
    document.querySelector('.f_alert_box').classList.remove('on');
}


const el_tr_chk = document.querySelectorAll('.tr_chk');

el_tr_chk.forEach((e)=>{
    e.addEventListener('click',(event)=>{
        event.stopPropagation();
    });
    if(e.type == 'radio'){
        let name = e.name;
        let chk_siblings = document.querySelectorAll(`.tr_chk[name=${name}]`);
        e.addEventListener('change',(event)=>{
            chk_siblings.forEach((el)=>{
                el.closest('tr').classList.remove('on');
            });
            if(e.checked){
                event.currentTarget.closest('tr').classList.add('on');
            }
        })
    }else{
        e.addEventListener('change',(event)=>{
            let table = e.closest('table');
            let tr_chk_all = table.querySelector('.tr_chk_all');
            if(e.checked){
                e.closest('tr').classList.add('on');
            }else{
                e.closest('tr').classList.remove('on');
                tr_chk_all.checked = false;
            }
        })
    }
});

// function checkAll(target){
//     let table = target.closest('table');
//     if(target.checked){
//         table.querySelectorAll('.tr_chk').forEach((e)=>{
//             e.checked = true;
//             e.closest('tr').classList.add('on');
//         });
//     }else{
//         table.querySelectorAll('.tr_chk').forEach((e)=>{
//             e.checked = false;
//             e.closest('tr').classList.remove('on');
//         });
//     }
// }



const chk_tr = document.querySelectorAll('.chk_tr');
chk_tr.forEach((e)=>{
    e.addEventListener('click',(event)=>{
        event.currentTarget.querySelector('.tr_chk').click();
    });
});

function mouse_position()
{
    let e = window.event;

    let posX = e.clientX;
    let posY = e.clientY;

    document.Form1.posx.value = posX;
    document.Form1.posy.value = posY;

    let t = setTimeout(mouse_position,100);

}


const ov_tooltip = document.querySelectorAll('.ov_tooltip');
ov_tooltip.forEach((e)=>{
    e.addEventListener('mouseenter',()=>{
        const ov_tooltip_cont = document.createElement('div');
        ov_tooltip_cont.classList.add('ov_tooltip_cont');
        ov_tooltip_cont.textContent = e.querySelector('.ov_tooltip_txt').textContent;
        e.append(ov_tooltip_cont);
    });
    e.addEventListener('mousemove',(event)=>{
        //console.log(event.pageX, event.pageY);
        e.querySelector('.ov_tooltip_cont').style.left = event.pageX+10+'px';
        e.querySelector('.ov_tooltip_cont').style.top = event.pageY+10+'px';
    });
    e.addEventListener('mouseleave',()=>{
        e.querySelector('.ov_tooltip_cont').remove()
    });
});


function tabs(target, idx){
    let tabs_wrap = target.closest('.tabs_wrap');
    let tabs_cont = tabs_wrap.querySelectorAll('.tabs_cont');
    let tabs_item = tabs_wrap.querySelectorAll('.tabs_item');
    let siblings = t => [...t.parentElement.children].filter(e => e != t);
    tabs_item[idx].classList.add('on');
    tabs_cont[idx].classList.add('on');

    siblings(tabs_item[idx]).forEach((e)=>{
        e.classList.remove('on')
    });
    siblings(tabs_cont[idx]).forEach((e)=>{
        e.classList.remove('on')
    })
}


const ellipsisTooltip = document.querySelectorAll('.ellipsisTooltip');
ellipsisTooltip.forEach((e)=>{
    e.addEventListener('mouseenter',function(){
        if(e.offsetWidth < e.scrollWidth){
            e.setAttribute('title',e.textContent);
        }
    });
});


const btn_gotop = document.querySelector('.btn_gotop');
window.addEventListener('scroll', function(){
    let pos_top = this.scrollY;
    let trigger_posY = window.outerHeight / 10;
    if(btn_gotop) {
        if(pos_top > trigger_posY){
            btn_gotop.classList.add('on')
        }else{
            btn_gotop.classList.remove('on')
        }
    }
    
});

function toast(target){
    let toast_wrap = document.querySelectorAll('.toast_wrap');
    toast_wrap.forEach(e=>{
        e.dataset.toast == target ? e.classList.add('on') : null;
    });
    ScrollLock.lock();
}
function close_toast(target){
    let toast_wrap = target.closest('.toast_wrap');
    toast_wrap.classList.remove('on');
    ScrollLock.unlock();
}




const ScrollLock = (() => {
  let lockCount = 0;

  const lock = () => {
    lockCount++;
    if (lockCount > 1) return; // 이미 잠금 중
    document.body.classList.add('scroll-locked');
  };

  const unlock = () => {
    if (lockCount === 0) return;
    lockCount--;
    if (lockCount > 0) return; // 아직 다른 레이어 남음
    document.body.classList.remove('scroll-locked');
  };

  return { lock, unlock };
})();




let notifyTimer = null;
let hideAfterInTimer = null; // 안전용(필요시)

function copyTxt(txt){
  navigator.clipboard.writeText(txt)
    .then(() => showNotify('복사되었습니다!'))
    .catch(err => {
      console.error('복사 실패:', err);
      showNotify('복사 실패');
    });
}

(function(){
  const box = document.getElementById('notify');
  const DURATION   = 1200;   // 표시 유지시간
  const TRANSITION = 200;    // CSS --dur 과 동일하게
  let hideTimer = 0;
  let restartTimer = 0;

  window.showNotify = function(msg){
    if (!box) return;

    // 타이머 정리
    clearTimeout(hideTimer);
    clearTimeout(restartTimer);

    // 이미 떠있는 중이면: 먼저 꺼짐 애니메이션 실행
    if (box.classList.contains('show')) {
      box.classList.remove('show');   // fade-out 시작
      box.offsetWidth;                // 리플로우로 상태 확정

      // 충분히 꺼질 시간을 준 뒤 다시 켜기
      restartTimer = setTimeout(() => {
        box.textContent = msg;
        box.classList.add('show');    // fade-in
        hideTimer = setTimeout(() => {
          box.classList.remove('show');
        }, DURATION);
      }, TRANSITION); // CSS와 동일 시간
      return;
    }

    // 안 떠있는 경우: 바로 켜기
    box.textContent = msg;
    box.classList.add('show');
    hideTimer = setTimeout(() => {
      box.classList.remove('show');
    }, DURATION);
  };
})();





// srch_form 클리어 버튼
// 값에 따라 클리어 버튼 토글
document.addEventListener('input', (e) => {
  const input = e.target.closest('.srch_form .f_input');
  if (!input) return;
  const form = input.closest('.srch_form');
  const clearBtn = form && form.querySelector('.btn_clear');
  if (clearBtn) clearBtn.classList.toggle('on', input.value.trim() !== '');
});

// 클리어 버튼 클릭 (지우고 포커스 유지)
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.srch_form .btn_clear');
  if (!btn) return;
  const form = btn.closest('.srch_form');
  const input = form && form.querySelector('.f_input');
  if (!input) return;
  input.value = '';
  input.dispatchEvent(new Event('input', { bubbles: true })); // 외부 리스너 갱신
  input.focus();
});

// 초기 상태 토글: 자동완성/SSR로 값이 미리 들어간 경우 대비
function initClearToggles() {
  document.querySelectorAll('.srch_form').forEach((form) => {
    const input = form.querySelector('.f_input');
    const btn = form.querySelector('.btn_clear');
    if (!input || !btn) return;
    btn.classList.toggle('on', !!input.value.trim());
  });
}
document.addEventListener('DOMContentLoaded', initClearToggles);
// 히스토리 복원(뒤로가기) 시 값 복원 대응
window.addEventListener('pageshow', initClearToggles);



// toast
function toast(target){
    let toast_wrap = document.querySelectorAll('.toast_wrap');
    toast_wrap.forEach(e=>{
        e.dataset.toast == target ? e.classList.add('on') : null;
    });
    ScrollLock.lock();
}
function close_toast(target){
    let toast_wrap = target.closest('.toast_wrap');
    toast_wrap.classList.remove('on');
    ScrollLock.unlock();
}