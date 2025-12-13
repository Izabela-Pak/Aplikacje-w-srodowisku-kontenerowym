# Section 1

Uruchomienie kontenera na podstawie obrazu ubuntu i pobranie źródła strony Google

![s1-1](s1-1.png)

![s1-2](s1-2.png)

Usunięcie kontenera oraz dodanie i usunięcie obrazu

![s1-3](s1-3.png)

![s1-4](s1-4.png)

# Section 2

Porównanie uruchamiania kontenera bez flagi, z flagą -t oraz z flagą -it. Dodatkowo uruchomienie kontenera i przekazanie mu gotowej komendy do wykonania

![s2-1](s2-1.png)

Sprawdzanie logów

![s2-2](s2-2.png)

Wykonanie polecenia listującego wszystkie pliki w domyślnym katalogu działającego kontenera

![s2-3](s2-3.png)

Uruchomienie powłoki Bash w kontenerze w trybie interaktywnym

![s2-4](s2-4.png)

Zatrzymanie i usunięcie kontenera 

![s2-5](s2-5.png)

Uruchomienie procesu z automatycznym usunięciem się po zakończeniu

![s2-6](s2-6.png)

## Ćwiczenia

Obraz devopsdockeruh/simple-web-service:ubuntu uruchomi kontener, który zapisuje logi do pliku. Wejdź do działającego kontenera i użyj tail -f ./text.log, aby śledzić logi. Co 10 sekund zegar wyśle Ci „sekretną wiadomość”.

Prześlij sekretne hasło i użyte polecenia w odpowiedzi.

![s2-7](s2-7.png)

Uruchom obraz Ubuntu z procesem sh -c 'while true; do echo "Input website:"; read website; echo "Searching.."; sleep 1; curl http://$website; done'

Zauważysz, że brakuje kilku elementów wymaganych do poprawnego działania. Przypomnij sobie, jakich flag użyć, aby kontener faktycznie czekał na dane wejściowe.

```
 docker run -it ubuntu sh -c "apt update && apt install -y curl && while true; do echo 'Input website:'; read website; echo 'Searching..'; sleep 1; curl http://$website; done"
```
![s2-8](s2-8.png)

![s2-9](s2-9.png)

# Section 3

Wyszukiwanie obrazów

![s3-1](s3-1.png)

Obraz alpine jest niemal sześciokrotnie mniejszy od obrazu ubuntu

![s3-2](s3-2.png)

Utworzenie obrazu z pliku Dockerfile

![s3-3](s3-3.png)

Uruchomienie kontenera, skopiowanie do niego pliku i zobaczenie zmian

![s3-4](s3-4.png)

![s3-5](s3-5.png)

Zapisanie zmian jako nowy obraz

![s3-6](s3-6.png)

## Ćwiczenia

Plik Dockerfile na bazie, którego został utworzony obraz curler

```
FROM ubuntu:22.04

WORKDIR /usr/src/app

RUN apt-get update \
    && apt-get install -y curl \
    && rm -rf /var/lib/apt/lists/*

COPY script.sh .

CMD ./script.sh

```
![s3-7](s3-7.png)

![s3-8](s3-8.png)

Plik Dockerfile na bazie, którego został utworzony obraz web-server, który uruchamia server

```
FROM devopsdockeruh/simple-web-service:alpine
CMD ["server"]
```

![s3-9](s3-8.png)

# Section 4

Uruchomienie kontenera, zainstalowanie odpowiednich zależności

![s4-1](s4-1.png)

Na tej podstawie napisano Dockerfile

```
FROM ubuntu:22.04

WORKDIR /mydir

RUN apt-get update && apt-get install -y curl python3
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
RUN chmod a+x /usr/local/bin/yt-dlp

CMD ["/usr/local/bin/yt-dlp"]
```

Zbudowanie obrazu i uruchomienie go

![s4-2](s4-2.png)

Aby dobrze działał należało zmienić CMD na ENTRYPOINT w Dockerfile

```
FROM ubuntu:22.04

WORKDIR /mydir

RUN apt-get update && apt-get install -y curl python3
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
RUN chmod a+x /usr/local/bin/yt-dlp

# Replacing CMD with ENTRYPOINT
ENTRYPOINT ["/usr/local/bin/yt-dlp"]
```

Teraz obraz działa poprawnie

![4-3](s4-3.png)

Ponownie edytowano Dockerfile

```
FROM ubuntu:22.04

WORKDIR /mydir

RUN apt-get update && apt-get install -y curl python3
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
RUN chmod a+x /usr/local/bin/yt-dlp

ENTRYPOINT ["/usr/local/bin/yt-dlp"]

# define a default argument
CMD ["https://www.youtube.com/watch?v=Aa55RKWZxxI"]
```

Teraz obraz się odpala bez podania argumentów, jak i z podaniem ich

![s4-4](s4-4.png)

Dzięki ENTRYPOINT ulepszono curler z poprzedniej sekcji

script.sh:
```
#!/bin/sh

  echo "Searching..";
  sleep 1;
  curl http://$1;
```

Dockerfile:
```
FROM ubuntu:22.04

WORKDIR /usr/src/app

RUN apt-get update \
    && apt-get install -y curl \
    && rm -rf /var/lib/apt/lists/*

COPY script.sh .

RUN chmod +x script.sh

ENTRYPOINT ["./script.sh"]
```

![s4-5](s4-5.png)

# Section 5

Uruchomienie kontenera z bind mount tak, aby logi były tworzone w osobistym systemie plików.

![s5-1](s5-1.png)

Uruchomienie servera na porcie 8080

![s5-2](s5-2.png)

![s5-3](s5-3.png)

# Section 6

Sklonowanie repozytorium 

![s6-1](s6-1.png)

Zbudowanie obrazu i uruchomienie go na porcie 3000

![s6-2](s6-2.png)

Plik dockerfile do tego przykładu
```
# Wersja Ruby
FROM ruby:3.1.0

# Port Rails
EXPOSE 3000

# Katalog roboczy w kontenerze
WORKDIR /usr/src/app

# Zainstaluj bundler
RUN gem install bundler:2.3.3

# Kopiuj Gemfile i Gemfile.lock, aby zainstalować zależności
COPY Gemfile* ./

# Instalacja zależności
RUN bundle install

# Kopiuj cały kod źródłowy
COPY . .

# Migracje bazy danych i prekompilacja assetów
RUN rails db:migrate RAILS_ENV=production
RUN rake assets:precompile

# Uruchomienie aplikacji
CMD ["rails", "s", "-e", "production"]
```

## Ćwiczenie 1.11

Dockerfile:

```
FROM amazoncorretto:11

EXPOSE 8080

WORKDIR /usr/src/app

# Kopiujemy cały projekt
COPY . .

# Install dos2unix and fix line endings
RUN yum install -y dos2unix \
    && dos2unix mvnw \
    && chmod +x mvnw

# Budujemy aplikację
RUN ./mvnw clean package -DskipTests

CMD ["java", "-jar", "target/spring-example-project-0.0.1-SNAPSHOT.jar"]

```



