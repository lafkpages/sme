{ pkgs }: {
    deps = [
      pkgs.nodePackages.vscode-langservers-extracted
      pkgs.nodePackages.typescript-language-server
      pkgs.nodePackages.prettier
      pkgs.haskellPackages.hjsmin
      pkgs.nodejs-16_x
      pkgs.yarn
      pkgs.replitPackages.jest
    ];
  }