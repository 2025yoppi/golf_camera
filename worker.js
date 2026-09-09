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
    // 日本(デフォルト)の場合は何もせず、下のフォールスルーで自然に privacy.html を解決させる
    // (ここで /privacy.html を明示fetchすると、拡張子なしURLへの正規化と衝突して無限リダイレクトになるため)
    if (url.pathname === "/privacy") {
      const country = request.cf ? request.cf.country : null;

      if (country && country !== "JP") {
        const intlRequest = new Request(new URL("/privacy-intl.html", url), request);
        const res = await env.ASSETS.fetch(intlRequest);
        return new Response(res.body, res);
      }
    }

    return env.ASSETS.fetch(request);
  }
};
