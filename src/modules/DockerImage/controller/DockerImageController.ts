import shell from "shelljs"

export default class DockerImageController{

    buildImage(imageName: string, dockerFileDir: string): boolean {
        if (shell.exec(`docker image build -t ${imageName}:1.0 ${dockerFileDir}`).code !== 0) {
            shell.echo('Error: docker image build failed');
            return false;
        }
        
        //* answer y to remove dangling image
        shell.exec('echo y | docker image prune');
        return true
    }

}