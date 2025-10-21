(function () {
  const pad = (n) => String(n).padStart(2, "0");
  const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;

  class EvtCalendar {
    constructor(root, opts = {}) {
      if (!root) throw new Error("evtcal: root element is required");
      this.root = root;

      // refs
      this.refs = {
        title: root.querySelector("#calTitle"),
        grid: root.querySelector("#calGrid"),
        panelTitle: root.querySelector("#panelTitle"),
        panel: root.querySelector("#eventContainer"),
        live: root.querySelector("#live"),
        prev: root.querySelector("#prevBtn"),
        next: root.querySelector("#nextBtn"),
        today: root.querySelector("#todayBtn"),
      };

      // state
      this.view = new Date(opts.initialDate || new Date());
      this.view = new Date(this.view.getFullYear(), this.view.getMonth(), 1);
      this.selected = null;
      this.events = opts.initialEvents || {};

      // callbacks
      this.onDateSelect = typeof opts.onDateSelect === "function" ? opts.onDateSelect : null;
      this.onMonthChange = typeof opts.onMonthChange === "function" ? opts.onMonthChange : null;
      this.onEventClick = typeof opts.onEventClick === "function" ? opts.onEventClick : null; // ✅ 추가

      // options
      this.opts = {
        autoSelectOnInit: false,
        autoSelectOnMonthChange: false,
        ...opts,
      };

      // listeners
      this.refs.prev?.addEventListener("click", () => this.changeMonth(-1));
      this.refs.next?.addEventListener("click", () => this.changeMonth(1));
      this.refs.today?.addEventListener("click", () => this.goToday());

      // initial render
      this.render(true);
      if (this.opts.autoSelectOnInit) this.autoSelectFirstWithEvents();
      else this.renderList(null);
    }

    async changeMonth(delta) {
      this.selected = null;
      this.view.setMonth(this.view.getMonth() + delta);
      await this.render(true);
      if (this.opts.autoSelectOnMonthChange) this.autoSelectFirstWithEvents();
      else this.renderList(null);
    }

    async goToday() {
      const now = new Date();
      this.view = new Date(now.getFullYear(), now.getMonth(), 1);
      this.selected = now;
      await this.render(true);
      this.renderList(ymd(now));
    }

    async render(shouldFetch = false) {
      const y = this.view.getFullYear();
      const m = this.view.getMonth();
      if (this.refs.title) this.refs.title.textContent = `${y}년 ${m + 1}월`;

      if (shouldFetch && this.onMonthChange) {
        try {
          const data = await this.onMonthChange(y, m);
          if (data && typeof data === "object") this.events = data;
        } catch {}
      }

      const grid = this.refs.grid;
      if (!grid) return;
      grid.innerHTML = "";

      const first = new Date(y, m, 1);
      const offset = first.getDay();
      const startDate = new Date(y, m, 1 - offset);
      const todayKey = ymd(new Date());

      for (let i = 0; i < 42; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        const key = ymd(d);
        const inMonth = d.getMonth() === m;
        const items = this.events[key] || [];
        const count = items.length;

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "evtcal-day";
        btn.setAttribute("role", "gridcell");
        btn.setAttribute("aria-label", `${key}${count ? `, 일정 ${count}개` : ""}`);

        if (!inMonth) btn.classList.add("muted");
        if (key === todayKey) btn.classList.add("today");
        if (this.selected && key === ymd(this.selected)) btn.classList.add("selected");
        if (count) btn.classList.add("has-event");

        btn.textContent = d.getDate();

        if (count) {
          const badge = document.createElement("span");
          badge.className = "evtcal-badge";
          badge.textContent = count;
          btn.appendChild(badge);
        }

        btn.addEventListener("click", () => {
          this.selected = d;
          this.root.querySelectorAll(".evtcal-day.selected").forEach((el) => el.classList.remove("selected"));
          btn.classList.add("selected");
          this.renderList(key);
          if (this.onDateSelect) this.onDateSelect(key, items);
        });

        grid.appendChild(btn);
      }
    }

    renderList(dateKey) {
      if (!dateKey) {
        this.refs.panelTitle && (this.refs.panelTitle.textContent = "이벤트");
        this.refs.panel && (this.refs.panel.innerHTML = `<div class="evtcal-empty">선택된 날짜가 없습니다.</div>`);
        this.refs.live && (this.refs.live.textContent = "선택된 날짜가 없습니다.");
        return;
      }

      const items = this.events[dateKey] || [];
      this.refs.panelTitle && (this.refs.panelTitle.textContent = `${dateKey} 일정 : ${items.length}개`);
      this.refs.live && (this.refs.live.textContent = `${dateKey} 일정 ${items.length}개`);

      const panel = this.refs.panel;
      if (!panel) return;
      panel.innerHTML = "";

      if (items.length === 0) {
        const empty = document.createElement("div");
        empty.className = "evtcal-empty";
        empty.textContent = "이 날짜에는 등록된 일정이 없습니다.";
        panel.appendChild(empty);
        return;
      }

      const list = document.createElement("div");
      list.className = "evtcal-list";

      items.forEach((ev) => {
        const row = document.createElement("div");
        row.className = "evtcal-item";
        row.innerHTML = `
          <div class="evtcal-time">${ev.time || "--:--"}</div>
          <div class="evtcal-title">${ev.title || ""}</div>
          ${ev.tag ? `<span class="evtcal-tag">${ev.tag}</span>` : ""}
        `;

        // ✅ 상세 처리 콜백(외부에서 주입)
        row.addEventListener("click", () => {
          if (this.onEventClick) this.onEventClick(ev);
        });

        list.appendChild(row);
      });

      panel.appendChild(list);
    }

    autoSelectFirstWithEvents() {
      const y = this.view.getFullYear();
      const m = this.view.getMonth();
      const first = new Date(y, m, 1);
      const offset = first.getDay();
      const startDate = new Date(y, m, 1 - offset);

      let picked = null;
      for (let i = 0; i < 42; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        const key = ymd(d);
        if (d.getMonth() === m && (this.events[key] || []).length) { picked = d; break; }
      }

      if (picked) {
        this.selected = picked;
        this.render(false);
        this.renderList(ymd(picked));
      } else {
        this.selected = null;
        this.render(false);
        this.renderList(null);
      }
    }
  }

  window.EvtCalendar = EvtCalendar;
})();