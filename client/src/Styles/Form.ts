import styled from "@emotion/styled";
import { ContrastProps } from '../Providers/Colors';
import { sizes } from "./Themes";
import { bodyMixin } from "./Typography";
import background from "/backgrounds/login.webp";
import background2 from "/backgrounds/login2.webp";

export const FormContainer = styled.div<ContrastProps>`
  box-sizing: border-box;
  width: calc(100vw + 5px);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  position: absolute;
  left: -5px;
  top: ${sizes.navbarHeight};
  ${({ colors }) => bodyMixin(colors)} 
  padding: 1rem;
  min-height: calc(100vh - ${sizes.navbarHeight});
  display: flex; /* Ustawienie flexboxa */
  flex-direction: column; /* Układanie elementów w kolumnie */
  align-items: center; /* Wyśrodkowanie elementów wzdłuż osi X */
  background-image: url(${background}); /* Ustawienie tła */
  background-size: 100% auto; /* Rozciąganie na szerokość, zachowanie proporcji */
  background-position: center; /* Ustawienie obrazu na górze i wyśrodkowanie */
  background-repeat: no-repeat; /* Zapobiega powtarzaniu obrazu */

  @media (min-width: 1450px) {
    background-image: url(${background2}); /* Zmiana tła powyżej 1300px szerokości */
  }
  @media (max-width: 1000px) {
    background-image: url(${background}); /* Ustawienie tła */
    background-size: cover; /* Dopasowanie tła do rozmiaru kontenera */
    background-position: center; /* Wyśrodkowanie tła */
  }
`;

export const FormContent = styled.div`
  width: 45%;
  margin-top: -5%;

  @media (max-width: 700px) {
    width: 26rem;
    margin-top: -6%;

  }
  @media (max-width: 450px) {
    width: 90%;
    margin-top: -6%;

  }
  @media (min-width: 1000px) {
    width: 30rem;
  margin-top: -10%;

  }
  @media (min-width: 1450px) {
    margin-left: 4%;
    margin-top: -9%;
    width: 28%;
  }
  text-align: center;
  display: flex; /* Ustawienie flexboxa */
  flex-direction: column; /* Układanie elementów w kolumnie */
  align-items: center; /* Wyśrodkowanie elementów wzdłuż osi X */
  & > * {
    width: 100%;
    margin: 0;
  }
`;
