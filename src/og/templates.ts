import { html } from "satori-html";

export const writing = ({
  text,
  image,
}: {
  text: string;
  image: string;
}) => html`
  <div class="flex h-full bg-white">
    <div class="mt-auto mb-auto flex flex-1 items-end gap-8 bg-white px-16">
      <div class="flex flex-7 flex-col">
        <p>Michał Paczków</p>
        <h1 class="text-5xl font-extrabold">${text}</h1>
      </div>
      <div class="flex flex-5">
        <div class="flex">
          <img src="${image}" alt="Default OG image" height="400" />
        </div>
      </div>
    </div>
  </div>
`;
