import { HeroParallax } from "@/components/ui/hero-parallax";
import { TracingBeam } from "@/components/ui/tracing-beam";

export default async function Home() {

  return (
    <>
      <HeroParallax products={products} />
      <TracingBeam className="px-6">
        <div>
          HELLO MY TEAM
        </div>
      </TracingBeam>
    </>
  );
}

export const products = [
  {
    title: "Projects",
    link: "http://localhost:3000/projects",
    thumbnail:
      "https://i0.wp.com/cluju.ro/wp-content/uploads/2021/04/utilaje-agricole.jpg",
  },
  {
    title: "Cadastres",
    link: "https://localhost:3000/cadastres",
    thumbnail:
      "https://t4.ftcdn.net/jpg/06/33/11/13/360_F_633111346_C0Y4kwsafjJTIC3odEOFO8nMckqYTObf.jpg",
  },
  {
    title: "My Cadastres",
    link: `https://localhost:3000/cadastres`,
    thumbnail:
      "https://media.licdn.com/dms/image/v2/C4E12AQFceagOicnMbQ/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1639496121833?e=2147483647&v=beta&t=4THdKEvHcb4eWIpC7SPsSTYjFFf5yWnt7ZKFWgKhIL8",
  },

  {
    title: "Projects",
    link: "http://localhost:3000/projects",
    thumbnail:
      "https://librainternacional.com.br/wp-content/uploads/2023/06/agro.jpg",
  },
  {
    title: "Find your provider",
    link: "http://localhost:3000/cadastres/find",
    thumbnail:
      "https://agri-connect.vercel.app/assets/images/bg2.jpg",
  },
  {
    title: "Cadastres",
    link: "http://localhost:3000/cadastres",
    thumbnail:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUx9fgIkda3m7n1NQBbZtA8gWTGaDE9ZYOfQ&s",
  },

  {
    title: "Find your provider",
    link: "http://localhost:3000/cadastres/find",
    thumbnail:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJN4wrbI6AKuxqktPo8oYwx7WF566PHVmjmA&s",
  },
  {
    title: "Cadastres",
    link: "http://localhost:3000/cadastres",
    thumbnail:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi02P1SuznPrq4WmhypKgYN7llyfqFBTfZng&s",
  },
  {
    title: "Projects",
    link: "http://localhost:3000/projects",
    thumbnail:
      "https://img.freepik.com/free-photo/truck-working-field-sunny-day_23-2151976947.jpg?semt=ais_hybrid&w=740&q=80",
  },
  {
    title: "Cadastres",
    link: "http://localhost:3000/cadastres",
    thumbnail:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl2vI-nyhLntwBoXjyMoBiRknQ0UmPzI9Hnw&s",
  },
  {
    title: "Projects",
    link: "http://localhost:3000/projects",
    thumbnail:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0Qca0uX-n6ysp3nHXajAmYVWcW-BdhlRDTA&s",
  },

  {
    title: "Find your provider",
    link: "http://localhost:3000/cadastres/find",
    thumbnail:
      "https://www.telefonica.com/en/wp-content/uploads/sites/5/2023/02/what-is-agrotech.jpg?w=1200",
  },
  {
    title: "Cadastres",
    link: "http://localhost:3000/cadastres",
    thumbnail:
      "https://media.istockphoto.com/id/1445789044/photo/tractor-spraying-vegetable-field-in-sunset.jpg?s=612x612&w=0&k=20&c=KTzbCMOOUswweefEqKEU3favFB23ljeAxm0e_YW6_H0=",
  },
  {
    title: "Cadastres",
    link: "http://localhost:3000/cadastres",
    thumbnail:
      "https://needagro.com/wp-content/uploads/2024/04/Agricultural-Iputs-670-x-380-px-2.png",
  },
  {
    title: "Projects",
    link: "http://localhost:3000/projects",
    thumbnail:
      "https://kyivindependent.com/_next/image?url=https%3A%2F%2Fassets.kyivindependent.com%2Fcontent%2Fimages%2F2024%2F02%2FGettyImages-1242186203.jpg&w=1536&q=75",
  },
];

