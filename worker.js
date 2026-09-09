export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // ルート("/" または "/index.html")へのアクセスのみ、アクセス元の国で背景を出し分ける
    if (url.pathname === "/" || url.pathname === "/index.html") {
      const country = request.cf ? request.cf.country : null;

      // country が取得できない(ローカル/一部ボット等)場合は日本向けをデフォルトにする
      if (country && country !== "JP") {
        const intlRequest = new Request(new URL("/index-intl.html", url), request);
        const res = await env.ASSETS.fetch(intlRequest);
        // index-intl.html の中身を "/" 用としてそのまま返す(URLはgolfswing-camera.comのまま)
        return new Response(res.body, res);
      }
    }

    // プライバシーポリシーページ("/privacy")も同様に国で出し分ける
    if (url.pathname === "/privacy") {
      const country = request.cf ? request.cf.country : null;
      const target = country && country !== "JP" ? "/privacy-intl.html" : "/privacy.html";
      const policyRequest = new Request(new URL(target, url), request);
      const res = await env.ASSETS.fetch(policyRequest);
      return new Response(res.body, res);
    }

    return env.ASSETS.fetch(request);
  }
};
